import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Motion" />
          <meta
            name="description"
            content="Video Metting, Video Chat, Video Conferencing and Screen Sharing App"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Motion" />

          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.webp" />
          {/* iPad */}
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/apple-touch-icon-152x152.webp"
          />
          {/* iPhone-retina */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon-180x180.webp"
          />

          <link
            rel="icon"
            type="image/webp"
            sizes="32x32"
            href="/icons/icon-32x32.webp"
          />
          <link
            rel="icon"
            type="image/webp"
            sizes="16x16"
            href="/icons/icon-16x16.webp"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
