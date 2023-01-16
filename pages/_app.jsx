import "../styles/main.scss";
import GlobalContextWrapper from "../context/globalContextWrapper";
import Script from "next/script";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [canLoadOneTrust, setCanLoadOneTrust] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setCanLoadOneTrust(true);
    }, 0);
  }, []);

  return (
    <GlobalContextWrapper>
      {pageProps.pageTemplateName !== "BrandTemplate" && canLoadOneTrust && (
        <>
          <Script
            id="onetrust"
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            charSet="UTF-8"
            data-domain-script={`${process.env.NEXT_PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT}`}
          />

          <Script id="optanon-wrapper">{`function OptanonWrapper() { }`}</Script>
        </>
      )}
      <Component {...pageProps} />
    </GlobalContextWrapper>
  );
}

export default MyApp;
