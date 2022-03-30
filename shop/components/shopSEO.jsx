import Head from "next/head";
import { breadcrumbs, organization, shop, webSite } from "../../schema";
const ShopSEO = ({ seo, children }) => {
  return (
    <Head>
      {seo?.metaTitle && <title key="title">{seo.metaTitle}</title>}
      {seo?.metaDescription && (
        <meta
          name="description"
          content={seo.metaDescription}
          key="description"
        />
      )}
      {seo?.ogTitle && (
        <meta property="og:title" content={seo.ogTitle} key="ogtitle" />
      )}
      {seo?.ogDescription && (
        <meta
          property="og:title"
          content={seo.ogDescription}
          key="ogdescription"
        />
      )}
      {seo?.ogImage && (
        <meta
          property="og:image"
          content={`${seo.ogImage}${"?q=50&w=1200&height=630format=auto"}`}
          key="ogimage"
        />
      )}
      {seo?.ogImage && seo?.metaTitle && (
        <meta
          property="og:image:alt"
          content={seo.metaTitle}
          key="ogimagealt"
        />
      )}
      {seo?.twitterImage && (
        <meta
          name="twitter:image"
          content={`${seo.twitterImage}${"?q=50&w=1200&height=630format=auto"}`}
          key="twitterimage"
        />
      )}
      {seo?.twitterImage && seo?.metaTitle && (
        <meta
          name="twitter:image:alt"
          content={seo.metaTitle}
          key="twitterimagealt"
        />
      )}
      {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo?.robots && <meta name="robots" content={seo.robots} />}
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:locale" content="en_US" key="oglocale" />
      <meta property="og:site_name" content="UJET" key="ogsitename" />
      <meta property="og:type" content="website" key="ogtype" />
      <meta name="twitter:card" content="summary" key="twittercard" />
      <meta name="twitter:creator" content="@UJETcx" key="twittercreator" />
      <meta name="twitter:site" content="@UJETcx" key="twittersite" />
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(webSite)}</script>
      <script type="application/ld+json">{shop}</script>
      <script type="application/ld+json">
        {breadcrumbs(process.env.NEXT_PUBLIC_SITE_URL + "/shop")}
      </script>
      {children}
    </Head>
  );
};

export default ShopSEO;
