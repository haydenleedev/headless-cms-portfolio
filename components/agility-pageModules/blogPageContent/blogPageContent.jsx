import dynamic from "next/dynamic";
const BlogPageContentWrap = dynamic(() => import("./blogPageContentWrap"), {
  ssr: false,
});

const BlogPageContent = ({ customData }) => {
  const { contentListTypes, highlightedPost } = customData; // includes only blog posts
  return (
    <BlogPageContentWrap
      contentListTypes={contentListTypes}
      highlightedPost={highlightedPost}
    />
  );
};

BlogPageContent.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;
  let contentListTypes = [
    {
      title: "Blog Posts",
      id: "blogposts",
      content: [],
      categories: null,
    },
  ];

  async function getContentList(referenceName) {
    // get total count of  to determine how many calls we need to get all pages
    // pass this entry as the highlighted blog post because it's the latest.
    const initial = await api.getContentList({
      referenceName,
      languageCode,
      take: 1,
    });

    let totalCount = initial.totalCount;
    let skip = 0;
    let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
      (call) => {
        let pagePromise = api.getContentList({
          referenceName,
          languageCode,
          take: 50, // 50 is max value for take parameter
          skip,
        });
        skip += 50;
        return pagePromise;
      }
    );
    promisedPages = await Promise.all(promisedPages);
    let contentList = [];
    promisedPages.map((result) => {
      contentList = [...contentList, ...result.items];
    });
    return contentList;
  }

  // returns the category names in a simple format eg "Case Study => case_study etc."
  function categoryNameSimple(title) {
    return title.toLowerCase().split(" ").join("_").split("-").join("_");
  }
  // get blog pots
  const highlightedPost = await api.getContentList({
    referenceName: "blogPosts",
    languageCode,
    sort: "fields.date",
    direction: "desc",
    take: 1,
  });
  const blogPosts = await getContentList("blogPosts");
  const categories = await getContentList("categories");
  let blogCategories = {};
  categories.forEach((category) => {
    blogCategories[categoryNameSimple(category.fields.title)] = {
      title: category.fields.title,
      content: [],
    };
  });
  Object.values(blogCategories).forEach((values) => {
    const relatedPosts = blogPosts.filter((post) =>
      post.fields?.categories?.some(
        (category) => category.fields.title === values.title
      )
    );
    values.content = relatedPosts;
  });
  contentListTypes[0].content = [...contentListTypes[0].content, ...blogPosts];
  contentListTypes[0].categories = blogCategories;

  return {
    contentListTypes,
    highlightedPost: highlightedPost.items[0],
  };
};

export default BlogPageContent;
