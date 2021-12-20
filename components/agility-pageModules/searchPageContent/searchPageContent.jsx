import algoliasearch from "algoliasearch/lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { renderHTML } from "@agility/nextjs";
import { getAlgoliaHighestResultFormatted } from "../../../utils/convert";
import style from "./searchPageContent.module.scss";
import AgilityLink from "../../agilityLink";

const SearchPageContent = ({ customData }) => {
  const { tags } = customData;
  const router = useRouter();
  const [activePageNumber, setActivePageNumber] = useState(0); // number of the current page.
  const [totalPagesCount, setTotalPagesCount] = useState(null); // total count of pages.
  const [currentOffset, setCurrentOffset] = useState(0); // current offset in the search results list.
  const [page, setPage] = useState(null); // the contents of current page.
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const PER_PAGE = 5; // how many results are shown per page

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  );
  const index = searchClient.initIndex("main-index");
  const basicSettings = {
    hitsPerPage: 1000,
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
    attributesToHighlight: ["title", "description", "headings"],
    attributesToSnippet: ["description:15", "headings:15"],
    snippetEllipsisText: "...",
  };
  useEffect(() => {
    setCurrentOffset(0);
    if (router.query.q && activeFilters.length > 0) {
      index
        .search(router.query.q, {
          ...basicSettings,
          tagFilters: activeFilters.map((filter) => {
            return filter;
          }),
        })
        .then((data) => {
          setSearchResults(data.hits);
        });
    } else if (router.query.q && activeFilters.length === 0) {
      index.search(router.query.q, basicSettings).then((data) => {
        setSearchResults(data.hits);
      });
    } else setSearchResults(null);
  }, [activeFilters]);

  // update the page content when current offset changes.
  useEffect(() => {
    if (activeFilters && searchResults)
      setPage(searchResults.slice(currentOffset, currentOffset + PER_PAGE));
    else if (searchResults)
      setPage(searchResults.slice(currentOffset, currentOffset + PER_PAGE));
  }, [currentOffset]);

  // reset offset and when search results list changes, update total pages count and set the content of the current page if the list is not null.
  useEffect(() => {
    setCurrentOffset(0);
    setActivePageNumber(0);
    if (searchResults) {
      setTotalPagesCount(Math.ceil(searchResults.length / PER_PAGE));
      setPage(searchResults.slice(currentOffset, currentOffset + PER_PAGE));
    }
  }, [searchResults]);

  // when some filter is selected, update the active filters list accordingly.
  const handleFiltersChange = (event, filter) => {
    if (!event.target.checked) {
      let newFilters = activeFilters.filter((active) => active !== filter);
      setActiveFilters(newFilters);
    } else {
      let newFilters = [...activeFilters, filter];
      setActiveFilters(newFilters);
    }
  };

  const previousPage = () => {
    const newPageNumber = activePageNumber - 1;
    if (newPageNumber >= 0) {
      setCurrentOffset(newPageNumber * PER_PAGE);
      setActivePageNumber(newPageNumber);
    }
  };

  const nextPage = () => {
    const newPageNumber = activePageNumber + 1;
    if (newPageNumber < totalPagesCount) {
      setCurrentOffset(newPageNumber * PER_PAGE);
      setActivePageNumber(newPageNumber);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className={style.searchPageContent}>
          <div className={style.contentList}>
            {searchResults && searchResults.length > 0
              ? page.map((result) => {
                  const description = getAlgoliaHighestResultFormatted(
                    result._snippetResult
                  );
                  return (
                    <div key={result.objectID}>
                      <AgilityLink agilityLink={{ href: result.path }}>
                        <p>{result._tags.join(", ")}</p>
                        <p
                          className={style.resultTitle}
                          dangerouslySetInnerHTML={renderHTML(
                            result._highlightResult.title.value
                          )}
                        ></p>
                        <p
                          dangerouslySetInnerHTML={renderHTML(description)}
                        ></p>
                      </AgilityLink>
                    </div>
                  );
                })
              : <p className="align-center">No results found.</p> || (
                  <p className="align-center">Nothing was searched for.</p>
                )}
          </div>
          <aside className={style.filterPanel}>
            <fieldset>
              <legend>Filter by:</legend>
              {tags.map((tag, i) => (
                <label key={i + "Checkbox"} htmlFor={i + "Checkbox"}>
                  <input
                    type="checkbox"
                    id={i + "Checkbox"}
                    checked={activeFilters.find((filter) => filter === tag)}
                    onChange={(event) => handleFiltersChange(event, tag)}
                  />
                  {tag}
                </label>
              ))}
            </fieldset>
          </aside>
          {/* Display the page numbers. truncate if there's a lot of pages*/}
          {searchResults && searchResults.length > 0 && (
            <footer className={style.pagination}>
              <div className="d-flex">
                <button
                  className={`reset-button ${style.previousPageButton}`}
                  onClick={previousPage}
                  disabled={activePageNumber === 0}
                ></button>
                {totalPagesCount && (
                  <>
                    {totalPagesCount < 8 ? (
                      [...Array(totalPagesCount).keys()].map((pageNumber) => (
                        <div
                          key={`pageButton${pageNumber}`}
                          className={
                            pageNumber === activePageNumber ? "w-600" : ""
                          }
                        >
                          <button
                            className={`reset-button ${style.pageButton}`}
                            onClick={() => {
                              setCurrentOffset(pageNumber * PER_PAGE);
                              setActivePageNumber(pageNumber);
                            }}
                            key={pageNumber}
                          >
                            {pageNumber + 1}
                          </button>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className={activePageNumber === 0 ? "w-600" : ""}>
                          <button
                            className={`reset-button ${style.pageButton}`}
                            onClick={() => {
                              setCurrentOffset(0);
                              setActivePageNumber(0);
                            }}
                            key={1}
                          >
                            1
                          </button>
                        </div>
                        {activePageNumber < 4 && (
                          <>
                            {[...Array(totalPagesCount).keys()]
                              .slice(1, 4)
                              .map((pageNumber) => (
                                <div
                                  key={`pageButton${pageNumber}`}
                                  className={
                                    pageNumber === activePageNumber
                                      ? "w-600"
                                      : ""
                                  }
                                >
                                  <button
                                    className={`reset-button ${style.pageButton}`}
                                    onClick={() => {
                                      setCurrentOffset(pageNumber * PER_PAGE);
                                      setActivePageNumber(pageNumber);
                                    }}
                                    key={pageNumber}
                                  >
                                    {pageNumber + 1}
                                  </button>
                                </div>
                              ))}
                            ...
                          </>
                        )}
                        {activePageNumber > 3 &&
                          activePageNumber < totalPagesCount - 3 && (
                            <>
                              ...
                              {[...Array(totalPagesCount).keys()]
                                .slice(
                                  activePageNumber - 1,
                                  activePageNumber + 2
                                )
                                .map((pageNumber) => (
                                  <div
                                    key={`pageButton${pageNumber}`}
                                    className={
                                      pageNumber === activePageNumber
                                        ? "w-600"
                                        : ""
                                    }
                                  >
                                    <button
                                      className={`reset-button ${style.pageButton}`}
                                      onClick={() => {
                                        setCurrentOffset(pageNumber * PER_PAGE);
                                        setActivePageNumber(pageNumber);
                                      }}
                                      key={pageNumber}
                                    >
                                      {pageNumber + 1}
                                    </button>
                                  </div>
                                ))}
                              ...
                            </>
                          )}
                        {activePageNumber > totalPagesCount - 4 && (
                          <>
                            ...
                            {[...Array(totalPagesCount).keys()]
                              .slice(totalPagesCount - 4, totalPagesCount - 1)
                              .map((pageNumber) => (
                                <div
                                  key={`pageButton${pageNumber}`}
                                  className={
                                    pageNumber === activePageNumber
                                      ? "w-600"
                                      : ""
                                  }
                                >
                                  <button
                                    className={`reset-button ${style.pageButton}`}
                                    onClick={() => {
                                      setCurrentOffset(pageNumber * PER_PAGE);
                                      setActivePageNumber(pageNumber);
                                    }}
                                    key={pageNumber}
                                  >
                                    {pageNumber + 1}
                                  </button>
                                </div>
                              ))}
                          </>
                        )}
                        <div
                          className={
                            activePageNumber === totalPagesCount - 1
                              ? "w-600"
                              : ""
                          }
                        >
                          <button
                            className={`reset-button ${style.pageButton}`}
                            onClick={() => {
                              setCurrentOffset(totalPagesCount - 1 * PER_PAGE);
                              setActivePageNumber(totalPagesCount - 1);
                            }}
                            key={totalPagesCount - 1}
                          >
                            {totalPagesCount}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
                <button
                  className={`reset-button ${style.nextPageButton}`}
                  onClick={nextPage}
                  disabled={activePageNumber + 1 === totalPagesCount}
                ></button>
              </div>
              <p>
                Showing {activePageNumber + 1} of {totalPagesCount}
              </p>
            </footer>
          )}
        </div>
      </div>
    </section>
  );
};

// we use getCustomInitialProps to crawl unique filtering tags from the Algolia index.
SearchPageContent.getCustomInitialProps = async function () {
  try {
    const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
    );
    const index = searchClient.initIndex("main-index");

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
