#!/usr/bin/env node

import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../vite.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const EXPORT_DIR = path.join(__dirname, '../exports')
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true })
}

const SERVER_URL = 'http://localhost:3000'
const DECKTAPE_CMD = 'npx decktape'

async function checkServerRunning() {
  console.log('📄 PDFへのエクスポートを開始します...')

  try {
    const response = await fetch(SERVER_URL)
    if (!response.ok) {
      throw new Error(`サーバーからのレスポンスが異常です: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ 開発サーバーが起動していません。先に `bun run dev` を実行してください。')
    process.exit(1)
  }
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr })
        return
      }
      resolve(stdout)
    })
  })
}

async function main() {
  try {
    await checkServerRunning()

    const inputFiles = config.build?.rollupOptions?.input || {}
    const htmlFiles = Object.values(inputFiles).filter((file) => file.endsWith('.html'))

    if (htmlFiles.length === 0) {
      console.error('❌ エクスポート対象のHTMLファイルが見つかりません。')
      process.exit(1)
    }

    for (const file of htmlFiles) {
      const pageName = path.basename(file, '.html')
      const url = `${SERVER_URL}${config.base}${file}`
      const outputPath = path.join(EXPORT_DIR, `${pageName}.pdf`)

      console.log(`🔍 処理中: ${pageName}.html`)

      try {
        const command = `${DECKTAPE_CMD} generic --size 1280x720 --load-pause 2000 --chrome-arg=--no-sandbox "${url}" "${outputPath}"`
        await runCommand(command)
        console.log(`✅ エクスポート完了: ${outputPath}`)
      } catch (error) {
        console.error(
          `❌ ${pageName}.htmlのエクスポート中にエラーが発生しました:`,
          error.error?.message || 'Unknown error',
        )
        if (error.stderr) console.error('エラー出力:', error.stderr)
      }
    }

    console.log('\n🎉 すべてのスライドのエクスポートが完了しました。')
    console.log(`📁 PDFファイルの保存先: ${EXPORT_DIR}`)
  } catch (error) {
    console.error('❌ エクスポート中にエラーが発生しました:', error)
    process.exit(1)
  }
}

main()
