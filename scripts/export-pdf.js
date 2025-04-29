import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import config from '../vite.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const EXPORT_DIR = path.join(__dirname, '../exports')
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true })
}

const SERVER_URL = 'http://localhost:3000'

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

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    for (const file of htmlFiles) {
      const pageName = path.basename(file, '.html')
      const url = `${SERVER_URL}/${file}?print-pdf`
      const outputPath = path.join(EXPORT_DIR, `${pageName}.pdf`)

      console.log(`🔍 処理中: ${pageName}.html`)

      const page = await browser.newPage()

      await page.goto(url, { waitUntil: 'networkidle0' })

      await page.pdf({
        path: outputPath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      })

      console.log(`✅ エクスポート完了: ${outputPath}`)
      await page.close()
    }
  } finally {
    await browser.close()
  }

  console.log('\n🎉 すべてのスライドのエクスポートが完了しました。')
  console.log(`📁 PDFファイルの保存先: ${EXPORT_DIR}`)
}

exportSlidesToPdf().catch((error) => {
  console.error('❌ エクスポート中にエラーが発生しました:', error)
  process.exit(1)
})
