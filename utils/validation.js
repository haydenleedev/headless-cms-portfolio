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
  return /^(www\.|assets\.|http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(ujet)\.cx?(\/.*)?$/.test(
    href
  );
};
