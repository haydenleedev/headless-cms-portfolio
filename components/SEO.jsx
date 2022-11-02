import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { breadcrumbs, organization, webSite } from "../schema";
import Script from "next/script";
import { getCookie, setCookie } from "../utils/cookies";
import { useContext } from "react";
import GlobalContext from "../context";
import { formatPageTitle } from "../utils/convert";
import { useRouter } from "next/router";
import { getCampaignScript } from "../utils/pardotForm";
import dynamic from "next/dynamic";

const SEO = ({
  title,
  description,
  keywords,
  metaHTML,
  url,
  pageTemplateName,
}) => {
  //Dynamically load scripts to "reduce unused javascript"
  const Scripts = dynamic(()=> import("./scripts"),{
    ssr:false
  })
  const [scrolled, setScrolled] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const campaignScriptAppendTimeout = useRef(null);
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  const qualifiedSrc = "https://js.qualified.com/qualified.js?token=";
  if (!getCookie("ga_cookie_date")) {
    setCookie(
      "ga_cookie_date",
      new Date().toUTCString(),
      "Fri, 31 Dec 9999 23:59:59 GMT"
    );
  }
  const { globalSettings, campaignScriptIDRef } = useContext(GlobalContext);
  const suffixedMetaTitle = formatPageTitle(
    title,
    globalSettings?.fields?.pageTitleSuffix
  );
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(true);
      window.removeEventListener("scroll", handleScroll);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    // Delay script loading with setTimeout
    setTimeout(() => {
      setTimerExpired(true);
    }, 0);

    router.events.on("routeChangeStart", () => {
      campaignScriptIDRef.current = null;
      clearTimeout(campaignScriptAppendTimeout.current);
      if (document.getElementById("campaignScript")) {
        document.head.removeChild(document.getElementById("campaignScript"));
      }
    });
    router.events.on("routeChangeComplete", async () => {
      campaignScriptAppendTimeout.current = setTimeout(() => {
        const scriptElements = document.head.getElementsByTagName("script");
        document.head.insertBefore(
          getCampaignScript(campaignScriptIDRef.current),
          scriptElements[scriptElements.length - 1].nextSibling
        );
      }, 2000);
    });
  }, []);

  return (
    <>
      <Head>
        <title key="title">{suffixedMetaTitle}</title>
        <meta name="generator" content="Agility CMS" />
        <meta name="agility_timestamp" content={new Date().toLocaleString()} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} key="description" />
        <meta name="keywords" content={keywords} />
        {/* Cloudflare Verification */}

        <meta name="cf-2fa-verify" content="c4be59459696dd6" />
        <meta name="cf-2fa-verify" content="1f8c066dd5d61c6" />
        {/* OG DATA */}
        <meta property="og:title" content={suffixedMetaTitle} key="ogtitle" />
        {url && <meta property="og:url" content={url} key="ogurl" />}
        <meta property="og:locale" content="en_US" key="oglocale" />
        <meta property="og:site_name" content="UJET" key="ogsitename" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta
          property="og:description"
          content={description}
          key="ogdescription"
        />
        <meta name="twitter:card" content="summary" key="twittercard" />
        <meta name="twitter:creator" content="@UJETcx" key="twittercreator" />
        <meta name="twitter:site" content="@UJETcx" key="twittersite" />
        {/* Note: this is usually overridden on component/page Head, since we can't easily get the image we want to use here as prop */}
        <meta
          property="og:image"
          content="https://assets.ujet.cx/FB-UJET-Image-V2.jpg"
          key="ogimage"
        />
        <meta
          property="og:image:alt"
          content={suffixedMetaTitle}
          key="ogimagealt"
        />

        {/* schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbs(url) }}
        />

        {/* TODO: add Canonical url */}
      </Head>
      {pageTemplateName !== "BrandTemplate" && (
        <>
          {timerExpired && (
           <Scripts />
          )}
                {/* Load Qualified script after user starts scrolling */}
      {scrolled && (
        <>
          {/* Qualified Script */}
          <Script id="qualified" strategy="lazyOnload">
            {`(function(w,q){w['QualifiedObject']=q;w[q]=w[q]||function(){
(w[q].q=w[q].q||[]).push(arguments)};})(window,'qualified')`}
          </Script>
          <Script
            id="qualified-src"
            async
            src={`${qualifiedSrc}${process.env.NEXT_PUBLIC_QUALIFIED_TOKEN}`}
            strategy="lazyOnload"
          />
        </>
      )}
        </>
      )}
    </>
  );
};

export default SEO;
