export const organization = `
"@type": "Organization",
"@id": "https://ujet.cx/#organization",
"name": "UJET",
"legalName", "UJET, Inc.",
"url": "https://ujet.cx/",
"sameAs": [
  "https://www.facebook.com/UJETcx/",
  "https://www.instagram.com/ujetcx/",
  "https://www.linkedin.com/company/ujetcx/",
  "https://www.youtube.com/ujetcx",
  "https://twitter.com/UJETcx"
],
"logo": "https://assets.ujet.cx/ujet-cx-logo.png",
"image" :"https://assets.ujet.cx/ujet-cx-logo.png"
`;

export const webSite = `
"@type": "WebSite",
"@id": "https://ujet.cx/#website",
"publisher": {
  @id: "https://ujet.cx/#organization"
}
"url": "https://ujet.cx/",
"name": "UJET",
"description": "Reimagining Customer Support for a Connected World",
"inLanguage": "en-US"
`;

export const blogPosting = ({
  headline,
  image,
  keywords,
  wordcount,
  url,
  datePublished,
  dateCreated,
  description,
  articleBody,
  authorName,
}) => {
  let data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    image: image ? image : null,
    keywords,
    wordcount,
    url,
    datePublished,
    dateCreated,
    description,
    articleBody,
    publisher: {
      "@id": "https://ujet.cx/#organization",
    },
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  return JSON.stringify(data);
};

export const article = ({
  headline,
  image,
  keywords,
  wordcount,
  url,
  datePublished,
  dateCreated,
  dateModified,
  description,
  articleBody,
}) => {
  let data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    image: image ? image : null,
    keywords,
    wordcount,
    url,
    datePublished,
    dateCreated,
    dateModified,
    description,
    articleBody,
    publisher: {
      "@id": "https://ujet.cx/#organization",
    },
  };

  return JSON.stringify(data);
};

// returns the breadCrumbList schema type in json+ld format
export const breadcrumbs = (url) => {
  const urlObject = new URL(url);
  let items = urlObject.pathname.split("/").slice(1);

  function crumbName(slug) {
    let name = slug.replace(/-/g, " ");
    name = name.replace(/_/g, " ");
    name = name.split(" ").map((word) => {
      return word.length > 3
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word;
    });
    return name.join(" ");
  }

  let data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@id": [urlObject.origin, ...items.slice(0, index + 1)].join("/"),
          name: crumbName(item),
        },
      })),
    ],
  };
  return JSON.stringify(data);
};
