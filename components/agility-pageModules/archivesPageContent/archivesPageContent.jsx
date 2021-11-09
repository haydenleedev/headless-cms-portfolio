import style from "./archivesPageContent.module.scss";
import { useEffect, useRef, useState } from "react";
import Loader from "../../layout/loader/loader";
import ArchiveCard from "./archiveCard";

const ArchivesPageContent = ({ customData }) => {
  const { contentListTypes } = customData;
  const [mounted, setMounted] = useState(false);
  const [activePageNumber, setActivePageNumber] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [page, setPage] = useState(null);
  const [activeContentList, setActiveContentList] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // currently selected category

  const categoryRefs = useRef([]);

  const PER_PAGE = 9; // how many cards are shown per page

  console.log(contentListTypes);

  useEffect(() => {
    if (!mounted) setMounted(true);
    else {
      setActiveContentList(contentListTypes[0]);
      setPage(
        contentListTypes[0].content.slice(
          currentOffset,
          currentOffset + PER_PAGE
        )
      );
      setTotalPagesCount(
        Math.ceil(contentListTypes[0].content.length / PER_PAGE)
      );
    }
  }, [mounted]);

  useEffect(() => {
    setCurrentOffset(0);
    setActiveCategory(null);
    if (activeContentList) {
      setTotalPagesCount(
        Math.ceil(activeContentList.content.length / PER_PAGE)
      );
      setPage(
        activeContentList.content.slice(currentOffset, currentOffset + PER_PAGE)
      );
    }
  }, [activeContentList]);

  useEffect(() => {
    setCurrentOffset(0);
    if (activeCategory) {
      setTotalPagesCount(
        Math.ceil(activeContentList.content.length / PER_PAGE)
      );
      setPage(
        activeContentList.categories[activeCategory].content.slice(
          currentOffset,
          currentOffset + PER_PAGE
        )
      );
    } else if (activeContentList) {
      setTotalPagesCount(
        Math.ceil(activeContentList.content.length / PER_PAGE)
      );
      setPage(
        activeContentList.content.slice(currentOffset, currentOffset + PER_PAGE)
      );
    }
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory)
      setPage(
        activeContentList.categories[activeCategory].content.slice(
          currentOffset,
          currentOffset + PER_PAGE
        )
      );
    else if (activeContentList)
      setPage(
        activeContentList.content.slice(currentOffset, currentOffset + PER_PAGE)
      );
  }, [currentOffset]);

  // reset page data when content list type changes
  const handleContentListTypeChange = (id) => {
    if (id.length === 0) return;
    setPage(null);
    const newType = contentListTypes.find((type) => type.id === id);
    setActiveContentList(newType);
  };

  const handleCategoryChange = (event, category) => {
    if (!event.target.checked) setActiveCategory(null);
    else setActiveCategory(category);
    categoryRefs.current.map((input) => {
      if (input.id !== event.target.id) {
        input.checked = false;
      }
    });
  };

  // the different content types use different fields for the card title
  const resolveTitle = (id, fields) => {
    switch (id) {
      case "news":
        return fields.articleTitle;
      default:
        return fields.title;
    }
  };

  // the different content types use different fields for the card link
  const resolveLink = (id, fields) => {
    switch (id) {
      case "news":
        return fields.link;
      default:
        return { href: fields.slug };
    }
  };

  const previousPage = () => {
    let newPageNumber = activePageNumber - 1;
    if (newPageNumber >= 0) {
      setCurrentOffset(newPageNumber * PER_PAGE);
      setActivePageNumber(newPageNumber);
    }
  };

  const nextPage = () => {
    let newPageNumber = activePageNumber + 1;
    if (newPageNumber < totalPagesCount) {
      setCurrentOffset(newPageNumber * PER_PAGE);
      setActivePageNumber(newPageNumber);
    }
  };
  return (
    <section className={`section ${style.archivesPageContent}`}>
      <nav
        className={`container ${style.navigationMenu}`}
        aria-label="news, press releases and resources navigation"
      >
        <aside className={style.filterPanel}>
          <label htmlFor="select-content-type">
            Content type
            <select
              id="select-content-type"
              className={style.contentTypeSelect}
              onChange={(event) =>
                handleContentListTypeChange(event.target.value)
              }
            >
              {activeContentList && (
                <>
                  {contentListTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.title}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
          {activeContentList && activeContentList.categories && (
            <fieldset>
              <legend>Category</legend>
              {Object.entries(activeContentList.categories).map(
                ([key, category], i) => (
                  <label key={key + "Checkbox"} htmlFor={key + "Checkbox"}>
                    <input
                      type="checkbox"
                      ref={(el) => (categoryRefs.current[i] = el)}
                      id={key + "Checkbox"}
                      onChange={(event) => handleCategoryChange(event, key)}
                    />
                    {category.title}
                  </label>
                )
              )}
            </fieldset>
          )}
        </aside>

        <div className={style.contentList}>
          {(page && (
            <div className="columns repeat-3">
              {page.map((item) => (
                <div key={item.contentID}>
                  <ArchiveCard
                    image={item.fields?.image}
                    title={resolveTitle(activeContentList.id, item.fields)}
                    link={resolveLink(activeContentList.id, item.fields)}
                  />
                </div>
              ))}
            </div>
          )) || <Loader />}
        </div>
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
                      className={pageNumber === activePageNumber ? "w-600" : ""}
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
                          ))}
                        ...
                      </>
                    )}
                    {activePageNumber > 3 &&
                      activePageNumber < totalPagesCount - 3 && (
                        <>
                          ...
                          {[...Array(totalPagesCount).keys()]
                            .slice(activePageNumber - 1, activePageNumber + 2)
                            .map((pageNumber) => (
                              <div
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
                          ))}
                      </>
                    )}
                    <div
                      className={
                        activePageNumber === totalPagesCount - 1 ? "w-600" : ""
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
      </nav>
    </section>
  );
};

ArchivesPageContent.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;
  let contentListTypes = [
    {
      title: "News",
      id: "news",
      content: [],
      categories: null,
    },
    {
      title: "Press Releases",
      id: "pressreleases",
      content: [],
      categories: null,
    },
    {
      title: "Resources",
      id: "resources",
      content: [],
      categories: {
        ebooks: { title: "e-Books", content: [] },
        guides: { title: "Guides", content: [] },
        integrations: { title: "Integrations", content: [] },
        reports: { title: "Reports", content: [] },
        webinars: { title: "Webinars", content: [] },
        whitePapers: { title: "White Papers", content: [] },
      },
    },
  ];

  async function getContentList(referenceName) {
    // get total count of  to determine how many calls we need to get all pages
    let initial = await api.getContentList({
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

  // get news
  const news = await getContentList("newsArticle");
  contentListTypes[0].content = [...contentListTypes[0].content, ...news];

  // get press releases
  const pressReleases = await getContentList("pressReleaseArticle");
  contentListTypes[1].content = [
    ...contentListTypes[1].content,
    ...pressReleases,
  ];

  // get resources: ebooks, guides, integrations, reports, webinars, white papers

  let ebooks = await getContentList("ebooks");
  let guides = await getContentList("guides");
  let integrations = await getContentList("integrations");
  let reports = await getContentList("reports");
  let webinars = await getContentList("webinars");
  let whitePapers = await getContentList("whitepapers");

  contentListTypes[2].content = [
    ...contentListTypes[2].content,
    ...ebooks,
    ...guides,
    ...integrations,
    ...reports,
    ...webinars,
    ...whitePapers,
  ].sort((a, b) => {
    if (
      new Date(a.fields.date).getMilliseconds() <
      new Date(b.fields.date).getMilliseconds()
    )
      return -1;
    if (
      new Date(a.fields.date).getMilliseconds() >
      new Date(b.fields.date).getMilliseconds()
    )
      return 1;

    return 0;
  });

  contentListTypes[2].categories.ebooks.content = [...ebooks];
  contentListTypes[2].categories.guides.content = [...guides];
  contentListTypes[2].categories.integrations.content = [...integrations];
  contentListTypes[2].categories.reports.content = [...reports];
  contentListTypes[2].categories.webinars.content = [...webinars];
  contentListTypes[2].categories.whitePapers.content = [...whitePapers];

  return {
    contentListTypes,
  };
};

export default ArchivesPageContent;
