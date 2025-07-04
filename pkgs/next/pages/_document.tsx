import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class Doc extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return(
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/RobotoMono/RobotoMono-Italic-VariableFont_wght.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/DotMatrix/DotMatrix.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Doc