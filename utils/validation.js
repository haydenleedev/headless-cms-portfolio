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

export const hrefSelf = (href) => {
  // test if passed href is an url address (e.g. https://www.ujet.cx) or an inner path (e.g. /home)
  // return true if either of the two tests is true
  return (
    /^(www\.|assets\.|http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(ujet)\.cx?(\/.*)?$/.test(
      href
    ) || /^\/[^\W_][\w-/#?&]*$/.test(href)
  );
};
