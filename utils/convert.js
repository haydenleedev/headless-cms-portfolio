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
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
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
    case "externalContent":
      return fields.link;
    case "pressreleasearticle":
      return "Press Release";
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
    case "pressreleasearticle":
      return { href: fields.slug };
    case "integrations":
      return { href: `/integrations/${fields.slug}` };
    case "whitepapers":
      return { href: `/resources/white-papers/${fields.slug}` };
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

export const youtubeVideoLinkToEmbed = (link) => {
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
        embedLink += parameter.value;
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

// use same config for all sanitizeHtml calls
export const sanitizeHtmlConfig = {
  allowedTags: false,
  allowedAttributes: {
    "*": [
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
      if (!hrefSelf(attribs.href)) {
        attribs.rel = "noindex noreferrer nofollow";
        attribs.target = "_blank";
      } else attribs.target = "_self";
      return {
        tagName: "a",
        attribs,
      };
    },
  },
};

export const getAlgoliaHighestResultFormatted = (result) => {
  let snippet;
  const headingMatch = result.headings
    ? result.headings.find(
        (heading) =>
          heading.matchLevel === "full" || heading.matchLevel === "partial"
      )
    : null;
  if (
    result.description.matchLevel === "full" ||
    result.description.matchLevel === "partial"
  )
    snippet = result.description.value;
  else if (headingMatch) snippet = headingMatch.value;
  else return "Read more...";

  return snippet;
};
