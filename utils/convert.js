// anything related to converting input to other format. E.g. convert date string from agility to different format.

export const toDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
