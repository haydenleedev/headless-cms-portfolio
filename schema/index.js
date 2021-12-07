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
  alternativeHeadline,
  image,
  genre,
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
    alternativeHeadline,
    image: image,
    genre,
    keywords,
    wordcount,
    url,
    datePublished,
    dateCreated: dateCreated,
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
  alternativeHeadline,
  image,
  genre,
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
    "@type": "Article",
    headline,
    alternativeHeadline,
    image,
    genre,
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
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  return JSON.stringify(data);
};

// TODO: add breadcrumbs logic
export const breadcrumbs = (url) => {
  const data = null;
  return JSON.stringify(data);
};
