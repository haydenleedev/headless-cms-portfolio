// anything related to converting input to other format. E.g. convert date string from agility to different format.

export const toDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
