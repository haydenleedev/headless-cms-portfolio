import Head from "next/head";
import { breadcrumbs, organization, webSite } from "../schema";
const SEO = ({ title, description, keywords, metaHTML, url }) => {
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  return (
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
  );
};

export default SEO;
