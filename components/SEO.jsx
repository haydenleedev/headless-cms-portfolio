import Head from "next/head";
const SEO = ({ title, description, keywords, ogImage, metaHTML, url }) => {
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  return (
    <Head>
      <meta name="robots" content="noindex,nofollow" />

      <title>{title}</title>
      <meta name="generator" content="Agility CMS" />
      <meta name="agility_timestamp" content={new Date().toLocaleString()} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {/* OG DATA */}
      <meta property="og:title" content={title} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="article" />
      <meta property="og:description" content={description} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:card" content="summary" />
      {/* Note: this is usually overridden on component/page Head, since we can't easily get the image we want to use here as prop */}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="twitter:image" content={ogImage} />
        </>
      )}
      {/* TODO: add Canonical url */}
    </Head>
  );
};

export default SEO;
