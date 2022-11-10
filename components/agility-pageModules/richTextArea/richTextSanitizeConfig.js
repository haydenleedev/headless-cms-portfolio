export const richTextSanitizeConfig = (bodyTextFontSize, headingFontSize) => {
    return {
      transformTags: {
        p: function (tagName, attribs) {
          return {
            tagName: "p",
            attribs: {
              class: bodyTextFontSize
                ? attribs.class + " " + bodyTextFontSize
                : "",
            },
          };
        },
        h1: function (tagName, attribs) {
          return {
            tagName: "h1",
            attribs: {
              class: headingFontSize
                ? attribs.class + " " + headingFontSize
                : "",
            },
          };
        },
        h2: function (tagName, attribs) {
          return {
            tagName: "h2",
            attribs: {
              class: headingFontSize
                ? attribs.class + " " + headingFontSize
                : "",
            },
          };
        },
        h3: function (tagName, attribs) {
          return {
            tagName: "h3",
            attribs: {
              class: headingFontSize
                ? attribs.class + " " + headingFontSize
                : "",
            },
          };
        },
        h4: function (tagName, attribs) {
          return {
            tagName: "h4",
            attribs: {
              class: headingFontSize
                ? attribs.class + " " + headingFontSize
                : "",
            },
          };
        },
        h5: function (tagName, attribs) {
          return {
            tagName: "h5",
            attribs: {
              class: headingFontSize
                ? attribs.class + " " + headingFontSize
                : "",
            },
          };
        },
        h6: function (tagName, attribs) {
          return {
            tagName: "h6",
            attribs: {
              class: headingFontSize
                ? attribs.class + " " + headingFontSize
                : "",
            },
          };
        },
      },
      allowedTags: false,
      allowedAttributes: false,
    };
  };