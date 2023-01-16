import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  // OneTrust should be loaded in _document.jsx because it has the beforeInteractive loading strategy.
  // More info: https://nextjs.org/docs/api-reference/next/script#beforeinteractive
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          id="onetrust"
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          charSet="UTF-8"
          strategy="beforeInteractive"
          data-domain-script={`${process.env.NEXT_PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT}`}
        />

        <Script
          id="optanon-wrapper"
          strategy="beforeInteractive"
        >{`function OptanonWrapper() { }`}</Script>
      </body>
    </Html>
  );
}
