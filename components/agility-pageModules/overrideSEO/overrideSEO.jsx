import { useEffect } from "react";
import Head from "next/head";
// this module overrides provided meta tags in the document head
const OverrideSEO = ({ module, additionalSchemas }) => {
  let fields = {};
  // cant update existing reference names for these agility fields so just standardize them all
  Object.entries(module.fields).map((entry) => {
    let key = entry[0];
    let value = entry[1];
    key = key.charAt(0) + key.charAt(1).toLowerCase() + key.slice(2); // e.g. oGTitle vs ogTitle, we want always the latter
    fields = { ...fields, [key]: value };
  });
  const {
    metaTitle,
    metaDescription,
    ogType,
    ogTitle,
    ogUrl,
    ogDescription,
    ogImage,
    ogImageURL,
    twitterCard,
    blockIndexing
  } = fields;

  // might be input either one depending on the context...
  // renaming agility api names of fields for existing data doesnt seem to work so need this workaround
  const og_image = ogImage?.url || ogImageURL;

  return (
    <Head>
      {metaTitle && <title key="title">{metaTitle}</title>}
      {metaDescription && (
        <meta name="description" content={metaDescription} key="description" />
      )}
      {ogTitle && <meta property="og:title" content={ogTitle} key="ogtitle" />}
      {ogUrl && <meta property="og:url" content={ogUrl} key="ogurl" />}
      {ogType && <meta property="og:type" content={ogType} key="ogtype" />}
      {ogDescription && (
        <meta
          property="og:description"
          content={ogDescription}
          key="ogdescription"
        />
      )}
      {og_image && (
        <meta
          property="og:image"
          content={`${og_image}${"?q=50&w=1200&height=630format=auto"}`}
          key="ogimage"
        />
      )}
      {metaTitle && (
        <meta property="og:image:alt" content={metaTitle} key="ogimagealt" />
      )}
      {twitterCard && (
        <meta name="twitter:card" content={twitterCard} key="twittercard" />
      )}
      {blockIndexing && (
        <meta name="robots" content="noindex" />
      )}
      {/* Any content-based additional schemas e.g. blogPosting type */}
      {additionalSchemas &&
        additionalSchemas.map((schema, index) => (
          <script type="application/ld+json" key={"additionalSchema" + index}>
            {schema}
          </script>
        ))}
    </Head>
  );
};

export default OverrideSEO;
