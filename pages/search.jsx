import Layout from "../components/layout/layout";
import SearchPageContent from "../components/searchPageContent/searchPageContent";

// no need for the search page to be in the CMS.
const SearchPage = () => {
  return (
    <Layout>
      <SearchPageContent />
    </Layout>
  );
};

export default SearchPage;
