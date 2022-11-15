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
    },
  };
};
