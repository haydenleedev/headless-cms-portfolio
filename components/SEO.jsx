import Head from "next/head";
import { breadcrumbs, organization, webSite } from "../schema";
import Script from "next/script";
import { setCookie } from "../utils/cookies";

const SEO = ({ title, description, keywords, metaHTML, url }) => {
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  setCookie(
    "ga_cookie_date",
    new Date().toUTCString(),
    "Fri, 31 Dec 9999 23:59:59 GMT"
  );
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta name="generator" content="Agility CMS" />
        <meta name="agility_timestamp" content={new Date().toLocaleString()} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} key="description" />
        <meta name="keywords" content={keywords} />
        {/* OG DATA */}
        <meta property="og:title" content={title} key="ogtitle" />
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
        <meta property="og:image:alt" content={title} key="ogimagealt" />

        {/* schema */}
        <script type="application/ld+json">{organization}</script>
        <script type="application/ld+json">{webSite}</script>
        <script type="application/ld+json">{breadcrumbs(url)}</script>

        {/* TODO: add Canonical url */}
      </Head>
      <Script id="google-tag-manager">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');`}
      </Script>
      <Script
        id="google-optimize"
        src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
        strategy="lazyOnload"
      />

      <Script id="6sense">
        {`window._6si = window._6si || [];
          window._6si.push(['enableEventTracking', true]);
          window._6si.push(['setToken', '${process.env.NEXT_PUBLIC_SIXSENSE_TOKEN}']);
          window._6si.push(['setEndpoint', 'b.6sc.co']);

          (function() {
            var gd = document.createElement('script');
            gd.type = 'text/javascript';
            gd.async = true;
            gd.src = '//j.6sc.co/6si.min.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gd, s);
          })();`}
      </Script>
    </>
  );
};

export default SEO;
