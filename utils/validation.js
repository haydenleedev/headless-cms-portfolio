// utility functions for checking input validity and sanitizing them where needed
import sanitizeHtml from "sanitize-html";

// use for checking true/false values coming from Agility.
export const boolean = (input) => {
  switch (input?.toLowerCase()) {
    case "false":
      return false;
    case "true":
      return true;
    default:
      return Boolean(input);
  }
};

// A helper function that checks whether a href is ujet.cx or an external one. Used for sanitizing HTML.
function hrefSelf(href) {
  return /^(www\.|assets\.|http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(ujet)\.cx?(\/.*)?$/.test(
    href
  );
}

// sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
export const cleanHtml = (html) => sanitizeHtml(html, {
  allowedAttributes: {
    "*": ["href", "target", "alt", "rel", "class"],
  },
  transformTags: {
    a: function (tagName, attribs) {
      if (!hrefSelf(attribs.href)) {
        attribs.rel = "noindex noreferrer nofollow";
      }
      return {
        tagName: "a",
        attribs,
      };
    },
  },
});