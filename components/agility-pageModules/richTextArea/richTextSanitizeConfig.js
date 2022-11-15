export const richTextSanitizeConfig = (bodyTextFontSize, headingFontSize) => {
  return {
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
        return {
          tagName: "p",
          attribs: {
            class: bodyTextFontSize
              ? attribs.class + " " + bodyTextFontSize
              : attribs.class,
          },
        };
      },
      h1: function (tagName, attribs) {
        return {
          tagName: "h1",
          attribs: {
            class: headingFontSize
              ? attribs.class + " " + headingFontSize
              : attribs.class,
          },
        };
      },
      h2: function (tagName, attribs) {
        return {
          tagName: "h2",
          attribs: {
            class: headingFontSize
              ? attribs.class + " " + headingFontSize
              : attribs.class,
          },
        };
      },
      h3: function (tagName, attribs) {
        return {
          tagName: "h3",
          attribs: {
            class: headingFontSize
              ? attribs.class + " " + headingFontSize
              : attribs.class,
          },
        };
      },
      h4: function (tagName, attribs) {
        return {
          tagName: "h4",
          attribs: {
            class: headingFontSize
              ? attribs.class + " " + headingFontSize
              : attribs.class,
          },
        };
      },
      h5: function (tagName, attribs) {
        return {
          tagName: "h5",
          attribs: {
            class: headingFontSize
              ? attribs.class + " " + headingFontSize
              : attribs.class,
          },
        };
      },
      h6: function (tagName, attribs) {
        return {
          tagName: "h6",
          attribs: {
            class: headingFontSize
              ? attribs.class + " " + headingFontSize
              : attribs.class,
          },
        };
      },
    },
  };
};
