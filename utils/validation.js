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
    ) || /^~?\/?[\w-/#?&=]*$/.test(href)
  );
};

export const checkRequiredSafariVersion = ({ desktop, mobile }) => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor;
    console.log(userAgent)
    console.log(vendor)
    if (vendor === "Apple Computer, Inc." && userAgent.indexOf("Safari") > -1) {
      const iOS = /(iPad|iPhone|iPod)/g.test(userAgent);
      const version = userAgent?.split("Version")[1]?.split("/")[1]?.split(" ")[0];
      if (iOS && parseInt(version) < parseInt(mobile)) {
        return {
          currentVersion: version,
          required: mobile,
          link: "https://support.apple.com/en-us/HT204416",
          message:
            "Please update your Safari browser for this site to function properly. \nHow to update to the latest Safari version:",
        };
      } else if (!iOS && parseInt(version) < parseInt(desktop)) {
        return {
          currentVersion: version,
          required: desktop,
          link: "https://support.apple.com/en-us/HT204416",
          message:
            "Please update your Safari browser or use Google Chrome for this site to function properly. \nHow to update to the latest Safari version:",
        };
      }
    }
  }
  return null;
};
