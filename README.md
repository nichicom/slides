# Slides

<img src="docs/images/logo.png" alt="reveal.js">

## Get Started

`git clone` 後、以下のコマンドを実行します。

```shell
$ make bs
```

環境が整っているかどうかを確認する場合は以下のコマンドを実行します。

```shell
$ make doctor
```

## 開発サーバーの起動

以下のコマンドで開発サーバーを起動できます:

```shell
$ bun run dev
```

## ビルド

以下のコマンドでビルドを実行できます:

```shell
$ bun run build
```

ビルドすると `docs` ディレクトリに出力されます。出力されたファイルは自動的にGitHub Pagesにデプロイされ、以下のURLで公開されます:

https://nichicom-sakurai.github.io/slides/


## 新しいページの追加

新しいHTMLページを追加した場合は、`vite.config.js`の`rollupOptions.input`に追加する必要があります：

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        // 新しいページを追加した場合はここに追記
        // 例: newpage: 'newpage.html'
      }
    }
  }
})
```

これにより、ビルド時に新しいページがバンドルに含まれるようになります。

## スライドの印刷方法

Reveal.js のスライドをPDFとして印刷する場合は、スライドのURL末尾に `?print-pdf` を付与してアクセスしてください。

例: [https://nichicom-sakurai.github.io/slides/sample.html?print-pdf](https://nichicom-sakurai.github.io/slides/sample.html?print-pdf)

その後、ブラウザの印刷ダイアログ（`Ctrl+P` または `Cmd+P`）を開き、以下の設定を推奨します：
- **送信先**: PDFに保存
- **レイアウト**: 横向き（Landscape）
- **余白**: なし
- **背景のグラフィック**: 有効

詳細な手順やオプションについては、Reveal.js公式ドキュメントもご参照ください。
- [Reveal.js PDF Export 公式ガイド](https://revealjs.com/pdf-export/)

