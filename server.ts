import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()

  let vite: any
  if (!isProduction) {
    // 開発モード: Vite開発サーバーをミドルウェアとして使用
    vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    // 本番モード: 静的ファイルを配信
    app.use(
      (await import('compression')).default()
    )
    app.use(
      (await import('sirv')).default('./dist/client', {
        extensions: []
      })
    )
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. index.htmlを読み込み
      let template: string
      let render: any

      if (!isProduction) {
        // 開発モード
        template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        )
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
      } else {
        // 本番モード
        template = fs.readFileSync(
          path.resolve(__dirname, './dist/client/index.html'),
          'utf-8'
        )
        render = (await import('./dist/server/entry-server.js')).render
      }

      // 2. アプリケーションをHTMLとしてレンダリング
      const { html: appHtml } = await render()

      // 3. テンプレートにアプリケーションHTMLを注入
      const html = template.replace(`<!--app-html-->`, appHtml)

      // 4. レスポンスを送信
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
      // エラーが発生した場合、スタックトレースを修正してクライアントに返す
      !isProduction && vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  const port = 3000
  app.listen(port, () => {
    console.log(`
🚀 サーバーが起動しました！

  ローカル:            http://localhost:${port}
  ネットワーク:        http://192.168.x.x:${port}

  Vue 3.5 Lazy Hydration デモ
  - Vite SSR
  - TypeScript
  - defineAsyncComponent with hydration strategies
    `)
  })
}

createServer()
