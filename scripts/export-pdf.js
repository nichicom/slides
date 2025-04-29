import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import config from '../vite.config.js'

const execFileAsync = promisify(execFile)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const EXPORT_DIR = path.join(__dirname, '../exports')
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true })
}

const SERVER_URL = 'http://localhost:3000'
const DECKTAPE_BIN = path.join(__dirname, '../node_modules/.bin/decktape')

async function exportSlidesToPdf() {
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

  const inputFiles = config.build?.rollupOptions?.input || {}
  const htmlFiles = Object.values(inputFiles).filter((file) => file.endsWith('.html'))

  if (htmlFiles.length === 0) {
    console.error('❌ エクスポート対象のHTMLファイルが見つかりません。')
    process.exit(1)
  }

  for (const file of htmlFiles) {
    const pageName = path.basename(file, '.html')
    const url = `${SERVER_URL}/${file}`
    const outputPath = path.join(EXPORT_DIR, `${pageName}.pdf`)

    console.log(`🔍 処理中: ${pageName}.html`)

    try {
      await execFileAsync(DECKTAPE_BIN, ['reveal', '--size', '1280x720', url, outputPath])

      console.log(`✅ エクスポート完了: ${outputPath}`)
    } catch (error) {
      console.error(`❌ ${pageName}.htmlのエクスポート中にエラーが発生しました:`, error.message)
      console.error('コマンド:', error.cmd)
      console.error('終了コード:', error.code)
      if (error.stderr) console.error('エラー出力:', error.stderr)
    }
  }

  console.log('\n🎉 すべてのスライドのエクスポートが完了しました。')
  console.log(`📁 PDFファイルの保存先: ${EXPORT_DIR}`)
}

exportSlidesToPdf().catch((error) => {
  console.error('❌ エクスポート中にエラーが発生しました:', error)
  process.exit(1)
})
