import Head from "next/head";
import { breadcrumbs, organization, webSite } from "../schema";
import Script from "next/script";

const SEO = ({ title, description, keywords, metaHTML, url }) => {
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
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
        src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
        strategy="lazyOnload"
      />
    </>
  );
};

export default SEO;
