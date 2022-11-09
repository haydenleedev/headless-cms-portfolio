import algoliasearch from "algoliasearch/lite";
import dynamic from "next/dynamic";
const SearchPageContentWrap = dynamic(() => import("./searchPageContentWrap"), {
  ssr: false,
});

const SearchPageContent = ({ customData }) => {
  const { tags } = customData;
  return <SearchPageContentWrap tags={tags} />;
};

// we use getCustomInitialProps to crawl unique filtering tags from the Algolia index.
SearchPageContent.getCustomInitialProps = async function () {
  try {
    const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
    );
    const index = searchClient.initIndex("dev_ujet");

    const tagSet = new Set();
    const data = await index.search("", {
      queryParameters: "_tags",
      hitsPerPage: 1000,
    });

    for (let i = 0; i < data.hits.length; i++) {
      data.hits[i]._tags.map((tag) => tagSet.add(tag));
    }

    return { tags: Array.from(tagSet) };
  } catch (error) {
    if (console) console.error(error);
  }
};

export default SearchPageContent;
