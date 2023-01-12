import { renderHTML } from "@agility/nextjs";
import Head from "next/head";
import { useContext } from "react";
import GlobalContext from "../../../context";
import { formatPageTitle } from "../../../utils/convert";

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
    ogUrl,
    ogImage,
    ogImageURL,
    twitterCard,
    twitterImage,
    canonicalURL,
    blockIndexing,
  } = fields;

  // might be input either one depending on the context...
  // renaming agility api names of fields for existing data doesnt seem to work so need this workaround
  const og_image = ogImage?.url || ogImageURL;
  const { globalSettings } = useContext(GlobalContext);
  const suffixedMetaTitle = formatPageTitle(
    metaTitle,
    globalSettings?.fields?.pageTitleSuffix
  );

  return (
    <Head>
      {suffixedMetaTitle && (
        <>
          <title key="title">{suffixedMetaTitle}</title>
          <meta property="og:title" content={suffixedMetaTitle} key="ogtitle" />
        </>
      )}
      {metaDescription && (
        <>
          <meta
            name="description"
            content={metaDescription}
            key="description"
          />
          <meta
            property="og:description"
            content={metaDescription}
            key="ogdescription"
          />
        </>
      )}
      {ogUrl && <meta property="og:url" content={ogUrl} key="ogurl" />}
      {ogType && <meta property="og:type" content={ogType} key="ogtype" />}
      {og_image && (
        <meta
          property="og:image"
          content={`${og_image}${"?q=50&w=1200&height=630format=auto"}`}
          key="ogimage"
        />
      )}
      {suffixedMetaTitle && (
        <meta
          property="og:image:alt"
          content={suffixedMetaTitle}
          key="ogimagealt"
        />
      )}
      {twitterCard && (
        <meta name="twitter:card" content={twitterCard} key="twittercard" />
      )}
      {twitterImage && (
        <meta
          name="twitter:image"
          content={`${twitterImage.url}${"?q=50&w=1200&height=630format=auto"}`}
          key="twitterimage"
        />
      )}
      {twitterImage && suffixedMetaTitle && (
        <meta
          name="twitter:image:alt"
          content={suffixedMetaTitle}
          key="twitterimagealt"
        />
      )}
      {canonicalURL && <link rel="canonical" href={canonicalURL} />}
      {blockIndexing && <meta name="robots" content="noindex, nofollow" />}
      {/* Any content-based additional schemas e.g. blogPosting type */}
      {additionalSchemas &&
        additionalSchemas.map((schema, index) => (
          <script
            type="application/ld+json"
            id={`additional-structured-data-${index}`}
            key={"additionalSchema" + index}
            dangerouslySetInnerHTML={renderHTML(schema)}
          />
        ))}
    </Head>
  );
};

export default OverrideSEO;
