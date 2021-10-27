// utility functions for checking input validity and sanitizing them where needed
// import sanitizeHtml from "sanitize-html";

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

