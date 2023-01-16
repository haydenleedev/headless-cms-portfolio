import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // OneTrust should be loaded in _document.jsx because it has the beforeInteractive loading strategy.
  // More info: https://nextjs.org/docs/api-reference/next/script#beforeinteractive
  // Not using next/script here because of https://github.com/vercel/next.js/issues/36997
  // TODO: replace native script tag with next/script (beforeInteractive) when next.js version is upgraded.
  return (
    <Html>
      <Head>
        <script
          type="text/javascript"
          id="onetrust"
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          async
          data-domain-script={`${process.env.NEXT_PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT}`}
        ></script>
        <script id="optanon-wrapper">{`function OptanonWrapper() { }`}</script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
