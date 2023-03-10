export const organization = {
  "@context": "https://schema.org/",
  "@type": "Organization",
  "@id": "https://ujet.cx/#organization",
  name: "UJET",
  legalName: "UJET, Inc.",
  url: "https://ujet.cx/",
  sameAs: [
    "https://www.facebook.com/UJETcx/",
    "https://www.instagram.com/ujetcx/",
    "https://www.linkedin.com/company/ujetcx/",
    "https://www.youtube.com/ujetcx",
    "https://twitter.com/UJETcx",
  ],
  logo: "https://assets.ujet.cx/ujet-cx-logo.png",
  image: "https://assets.ujet.cx/ujet-cx-logo.png",
};

export const webSite = {
  "@context": "https://schema.org/",
  "@type": "WebSite",
  "@id": "https://ujet.cx/#website",
  publisher: organization,
  url: "https://ujet.cx/",
  name: "UJET",
  description: "Reimagining Customer Support for a Connected World",
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const webPage = ({ url, name, description, breadcrumb, speakable }) => {
  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "WebPage",
    name,
    description,
    publisher: organization,
    breadcrumb,
    speakable,
    url,
  });
};

export const imageObject = (imageSrc) => {
  return {
    "@context": "https://schema.org/",
    "@type": "ImageObject",
    contentUrl: imageSrc,
    license: "https://ujet.cx",
    acquireLicensePage: "https://ujet.cx",
    creditText: "UJET",
    copyrightNotice: "UJET",
    creator: {
      "@type": "Organization",
      name: "UJET",
    },
  };
};

export const faqPage = (items) => {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((qa) => {
      return {
        "@type": "Question",
        name: qa.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: qa.answer,
        },
      };
    }),
  });
};

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
    publisher: organization,
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
    publisher: organization,
  };

  return JSON.stringify(data);
};

export const shop = `
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "UJET Packages",
  "image": "https://assets.ujet.cx/BuyerGuideimage.jpg",
  "description": "Purchase an UJET package now.",
  "sku": "0446310786",
  "mpn": "925872",
  "brand": {
    "@type": "Brand",
    "name": "UJET"
  },
  "offers": {
    "@type": "AggregateOffer",
    "url": "${process.env.NEXT_PUBLIC_SITE_URL}/pricing",
    "priceCurrency": "USD",
    "offerCount": "4",
    "lowPrice": "65.00",
    "highPrice": "120.00"
  }
}
`;

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
  return data;
};

export const speakable = {
  "@type": "SpeakableSpecification",
  xPath: ["/html/head/title", "/html/head/meta[@name='description']/@content"],
};

export const event = ({
  name,
  startDate,
  endDate,
  eventType,
  location,
  description,
}) => {
  const resolveEventLocation = (eventType) => {
    if (eventType === "Virtual" || eventType === "Webinar") {
      return {
        "@type": "VirtualLocation",
        url: location.url,
      };
    }
    return location.place;
  };
  const resolveEventAttendanceMode = (eventType) => {
    if (eventType === "Virtual" || eventType === "Webinar")
      return "https://schema.org/OnlineEventAttendanceMode";
    return "https://schema.org/OfflineEventAttendanceMode";
  };
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    startDate,
    endDate,
    location: resolveEventLocation(eventType),
    eventAttendanceMode: resolveEventAttendanceMode(eventType),
    eventStatus: "https://schema.org/EventScheduled",
    description,
  };
};

export const video = ({
  description,
  name,
  thumbnailUrl,
  uploadDate,
  embedUrl,
  contentUrl,
}) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    embedUrl,
    contentUrl,
  };
  if (!embedUrl) delete data.embedUrl;
  else if (!contentUrl) delete data.contentUrl;
  return JSON.stringify(data);
};
