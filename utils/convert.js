// anything related to converting input to other format. E.g. convert date string from agility to different format.

import { hrefSelf } from "./validation";

export const toDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const toPacificDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    //  hour: "2-digit",
    //  minute: "2-digit",
    // timeZone: "America/Los_Angeles",
    // timeZoneName: "short",
  });
};

// convert given Date object to pacific time
// returns ms
export const toPacificTimeMilliseconds = (date) => {
  // Pacific Time time zone offset (GMT-08)
  const pacificTimeOffset = -8;
  return date.getTime() + pacificTimeOffset * 3600 * 1000;
};

export const sortContentListByDate = (list) => {
  const sorted = list.sort((a, b) => {
    if (Date.parse(a.fields.date) > Date.parse(b.fields.date)) return -1;
    if (Date.parse(a.fields.date) < Date.parse(b.fields.date)) return 1;

    return 0;
  });
  return sorted;
};

// needed for handling category selections in the blog menu on /blog
export const removeDuplicatePosts = (list) => {
  return list.filter(
    (item, index, self) =>
      index === self.findIndex((post) => post.fields.slug === item.fields.slug)
  );
};

// return name based on the content referenceName
export const resolveCategory = (referenceName) => {
  switch (referenceName) {
    case "newsarticle":
      return "News";
    case "externalcontent":
      return fields.link;
    case "pressreleasearticle":
      return "Press Release";
    case "casestudy":
      return "Case Study";
    case "ebooks":
      return "e-Book";
    case "guides":
      return "Guide";
    case "webinars":
      return "Webinar";
    case "whitepapers":
      return "White Paper";
    case "integrations":
      return "Product Datasheet";
    case "reports":
      return "Report";
    case "partnercontent":
      return "Partner Content";
    case "blogposts":
      return "Blog";
    default:
      return referenceName;
  }
};

// the different content types use different fields for navigation
export const resolveLink = (referenceName, fields) => {
  switch (referenceName) {
    case "newsarticle":
      return fields.link;
    case "externalcontent":
      return fields.link;
    case "pressreleasearticle":
      return { href: `/press-releases/${fields.slug}` };
    case "blogposts":
      return { href: `/blog/${fields.slug}` };
    case "integrations":
      return { href: `/integrations/${fields.slug}` };
    case "whitepapers":
      return { href: `/resources/white-papers/${fields.slug}` };
    case "casestudy":
      return { href: `/resources/case-study/${fields.slug}` };
    case "partnercontent":
      return { href: `/resources/partner-content/${fields.slug}` };
    default:
      return { href: `/resources/${referenceName}/${fields.slug}` };
  }
};

// convert a youtube video's URL to one of the following embed video link formats:

//https://www.youtube.com/watch?v=FdJdgNSwCk0&list=PL7-AgcumQJ_vDJxffzPToGDRjg7H6WHCD

// for a video: https://www.youtube.com/embed/VIDEO_ID
// for a playlist: https://www.youtube.com/embed/?listType=playlist&list=PLAYLIST_ID
// for an user's uploaded videos: https://www.youtube.com/embed?listType=user_uploads&list=USERNAME
// reference: https://developers.google.com/youtube/player_parameters

export const youTubeVideoLinkToEmbed = (link) => {
  // split yt link parameters
  let parameters = link
    .split("?")[1]
    .split("&")
    .map((entry) => {
      const parameter = entry.split("=");
      return { name: parameter[0], value: parameter[1] };
    });

  // set the base link
  let embedLink = link.split("/watch?v=")[0] + "/embed/";

  // run though parameters and add corresponding
  parameters.forEach((parameter) => {
    switch (parameter.name) {
      case "v":
        embedLink += parameter.value + "?enablejsapi=1";
        break;
      case "list":
        embedLink += `?listType=playlist&list=${parameter.value}`;
        break;
      default:
        break;
    }
  });
  return embedLink;
};

// Convert a Vimeo video's url to the proper format for embedding
export const vimeoLinkToEmbed = (link) => {
  const videoNumber = link.split(/vimeo.com\//)[1];
  return `https://player.vimeo.com/video/${videoNumber}`;
};

// use same config for all sanitizeHtml calls
export const sanitizeHtmlConfig = {
  allowedTags: false,
  allowedAttributes: {
    img: [
      "loading",
      "srcset",
      "style",
      "class",
      "id",
      "src",
      "width",
      "height",
      "alt",
      "sizes",
      "decoding",
      "srcSet",
    ],
    "*": [
      "loading",
      "srcset",
      "href",
      "target",
      "alt",
      "rel",
      "class",
      "id",
      "src",
      "width",
      "height",
    ],
  },
  transformTags: {
    a: function (tagName, attribs) {
      // Remove trailing slash
      if (attribs.href) {
        attribs.href = attribs.href.replace(/\/$/, "");
      }
      if (!hrefSelf(attribs.href)) {
        attribs.rel = "noindex noreferrer nofollow";
        attribs.target = "_blank";
      } else attribs.target = "_self";
      return {
        tagName: "a",
        attribs,
      };
    },
    img: function (tagName, attribs) {
      const newAttribs = { ...attribs };
      const altText = newAttribs?.alt;
      //Clear existing queries from img source
      let source = newAttribs.src;
      if (source.includes("?")) {
        source = source.slice(0, source.indexOf("?"));
      }
      source = source.replace(/ /g, "%20");
      const isSvg = /.+.svg$/g.test(source);
      const srcset = isSvg
        ? null
        : `${source}?q=75&w=280&format=auto 280w, ${source}?q=75&w=360&format=auto 360w, ${source}?q=75&w=375&format=auto 375w, ${source}?q=75&w=480&format=auto 480w, ${source}?q=75&w=640&format=auto 640w, ${source}?q=75&w=768&format=auto 768w, ${source}?q=75&w=890&format=auto 890w`;

      return {
        tagName,
        attribs: {
          ...newAttribs,
          src: isSvg ? source : `${source}?q=75&format=auto&w=890`,
          alt: altText ? altText : "",
          loading: "lazy",
          srcset,
          sizes: "(max-width: 480px) 360px, 50vw",
          width: "680",
          height: "336",
          style: "max-width: 100%; width: 100%;",
          decoding: "async",
        },
      };
    },
  },
};
//Used to apply custom text classes to html
export const textSizeSanitizeConfig = (
  bodyTextFontSize,
  headingFontSize,
  roundedCornersForImages,
  centerImagesHorizontally,
  imageSpacingTop,
  imageSpacingBottom
) => {
  return {
    allowedTags: false,
    allowedAttributes: {
      img: [
        "loading",
        "srcset",
        "style",
        "class",
        "id",
        "src",
        "width",
        "height",
        "alt",
        "sizes",
      ],
      "*": [
        "loading",
        "srcset",
        "href",
        "target",
        "alt",
        "rel",
        "class",
        "id",
        "src",
        "width",
        "height",
      ],
    },
    transformTags: {
      a: function (tagName, attribs) {
        // Remove trailing slash
        if (attribs.href) {
          attribs.href = attribs.href.replace(/\/$/, attribs.class);
        }
        if (!hrefSelf(attribs.href)) {
          attribs.rel = "noindex noreferrer nofollow";
          attribs.target = "_blank";
        } else attribs.target = "_self";
        return {
          tagName: "a",
          attribs,
        };
      },
      p: function (tagName, attribs) {
        if (bodyTextFontSize && attribs.class)
          return {
            tagName: "p",
            attribs: {
              class: attribs.class + " " + bodyTextFontSize,
            },
          };
        else if (bodyTextFontSize && !attribs.class)
          return {
            tagName: "p",
            attribs: {
              class: bodyTextFontSize,
            },
          };
        else return { tagName: "p", attribs };
      },
      h1: function (tagName, attribs) {
        if (headingFontSize && attribs.class)
          return {
            tagName: "h1",
            attribs: {
              class: attribs.class + " " + headingFontSize,
            },
          };
        else if (headingFontSize && !attribs.class)
          return {
            tagName: "h1",
            attribs: {
              class: headingFontSize,
            },
          };
        else return { tagName: "h1", attribs };
      },
      h2: function (tagName, attribs) {
        if (headingFontSize && attribs.class)
          return {
            tagName: "h2",
            attribs: {
              class: attribs.class + " " + headingFontSize,
            },
          };
        else if (headingFontSize && !attribs.class)
          return {
            tagName: "h2",
            attribs: {
              class: headingFontSize,
            },
          };
        else return { tagName: "h2", attribs };
      },
      h3: function (tagName, attribs) {
        if (headingFontSize && attribs.class)
          return {
            tagName: "h3",
            attribs: {
              class: attribs.class + " " + headingFontSize,
            },
          };
        else if (headingFontSize && !attribs.class)
          return {
            tagName: "h3",
            attribs: {
              class: headingFontSize,
            },
          };
        else return { tagName: "h3", attribs };
      },
      h4: function (tagName, attribs) {
        if (headingFontSize && attribs.class)
          return {
            tagName: "h4",
            attribs: {
              class: attribs.class + " " + headingFontSize,
            },
          };
        else if (headingFontSize && !attribs.class)
          return {
            tagName: "h4",
            attribs: {
              class: headingFontSize,
            },
          };
        else return { tagName: "h4", attribs };
      },
      h5: function (tagName, attribs) {
        if (headingFontSize && attribs.class)
          return {
            tagName: "h5",
            attribs: {
              class: attribs.class + " " + headingFontSize,
            },
          };
        else if (headingFontSize && !attribs.class)
          return {
            tagName: "h5",
            attribs: {
              class: headingFontSize,
            },
          };
        else return { tagName: "h5", attribs };
      },
      h6: function (tagName, attribs) {
        if (headingFontSize && attribs.class)
          return {
            tagName: "h6",
            attribs: {
              class: attribs.class + " " + headingFontSize,
            },
          };
        else if (headingFontSize && !attribs.class)
          return {
            tagName: "h6",
            attribs: {
              class: headingFontSize,
            },
          };
        else return { tagName: "h6", attribs };
      },
      img: function (tagName, attribs) {
        if (
          roundedCornersForImages ||
          centerImagesHorizontally ||
          imageSpacingTop ||
          imageSpacingBottom
        ) {
          const newAttribs = { ...attribs };
          //Clear existing queries from img source
          let source = newAttribs.src;
          if (source.includes("?")) {
            source = source.slice(0, source.indexOf("?"));
          }
          const isSvg = /.+.svg$/g.test(source);

          //Apply image classes and alt text
          const className = newAttribs?.class;
          const altText = newAttribs?.alt;
          const srcset = isSvg
            ? null
            : `${source}?q=75&w=280&format=auto 280w, ${source}?q=75&w=360&format=auto 360w, ${source}?q=75&w=375&format=auto 375w, ${source}?q=75&w=480&format=auto 480w, ${source}?q=75&w=640&format=auto 640w, ${source}?q=75&w=768&format=auto 768w, ${source}?q=75&w=890&format=auto 890w`;

          let classNamesToApply = " ";
          if (roundedCornersForImages) classNamesToApply += " border-radius-1";
          if (centerImagesHorizontally)
            classNamesToApply += " d-flex ml-auto mr-auto";
          if (imageSpacingBottom) classNamesToApply += ` ${imageSpacingBottom}`;
          if (imageSpacingTop) classNamesToApply += ` ${imageSpacingTop}`;
          if (newAttribs.class) delete newAttribs.class;
          return {
            tagName,
            attribs: {
              ...newAttribs,
              src: isSvg ? source : `${source}?q=75&format=auto&w=890`,
              class: className
                ? className + classNamesToApply
                : classNamesToApply,
              alt: altText ? altText : "",
              loading: "lazy",
              srcset,
              sizes: "(max-width: 480px) 360px, 50vw",
              width: "680",
              height: "336",
              style: "max-width: 100%; width: 100%;",
              decoding: "async",
            },
          };
        } else {
          const newAttribs = { ...attribs };
          //Clear existing queries from img source
          let source = newAttribs.src;
          if (source.includes("?")) {
            source = source.slice(0, source.indexOf("?"));
          }
          const altText = newAttribs?.alt;
          const isSvg = /.+.svg$/g.test(source);
          const srcset = isSvg
            ? null
            : `${source}?q=75&w=280&format=auto 280w, ${source}?q=75&w=360&format=auto 360w, ${source}?q=75&w=375&format=auto 375w, ${source}?q=75&w=480&format=auto 480w, ${source}?q=75&w=640&format=auto 640w, ${source}?q=75&w=768&format=auto 768w, ${source}?q=75&w=890&format=auto 890w`;

          return {
            tagName,
            attribs: {
              ...newAttribs,
              src: isSvg ? source : `${source}?q=75&format=auto&w=890`,
              alt: altText ? altText : "",
              loading: "lazy",
              srcset,
              sizes: "(max-width: 480px) 360px, 50vw",
              width: "680",
              height: "336",
              style: "max-width: 100%; width: 100%;",
              decoding: "async",
            },
          };
        }
      },
    },
  };
};
export const getAlgoliaHighestResultFormatted = (result) => {
  let snippet;
  const headingMatch = result?.headings
    ? result?.headings?.find(
        (heading) =>
          heading?.matchLevel === "full" || heading?.matchLevel === "partial"
      )
    : null;
  if (
    result?.description?.matchLevel === "full" ||
    result?.description?.matchLevel === "partial"
  )
    snippet = result?.description?.value;
  else if (headingMatch) snippet = headingMatch.value;
  else return "Read more...";

  return snippet;
};

export const formatPageTitle = (title, suffix) => {
  if (title && suffix && !title.includes(`| ${suffix}`)) {
    if (title.includes(`- ${suffix}`)) {
      return title.replace(`- ${suffix}`, `| ${suffix}`);
    } else {
      return `${title} | ${suffix}`;
    }
  }
  return title;
};

export const convertUJETLinksToHttps = (html) => {
  return html?.replace(/http:\/\/ujet.cx/g, "https://ujet.cx");
};

//Clean html tags from text and return a string
export const cleanText = (string) => {
  const cleanText = string.replace(/<\/?[^>]+(>|$)/g, "");
  return cleanText;
};

export const remToPixels = (rem) => {
  return typeof window !== "undefined"
    ? parseFloat(rem) *
        parseFloat(getComputedStyle(document.documentElement).fontSize)
    : null;
};
