// vite.config.js
export default {
  base: '/slides/',
  server: {
    port: 3000, // ポート3000
    open: true, // 起動時ブラウザ自動オープン
  },
  build: {
    outDir: 'docs', // ビルド出力先をdocsに設定
    rollupOptions: {
      input: {
        main: 'index.html',
        toronoba: 'sample.html',
        mdSample: 'md-sample.html',
      },
    },
  },
  publicDir: 'public', // publicフォルダの内容を常にバンドルに含める
}
