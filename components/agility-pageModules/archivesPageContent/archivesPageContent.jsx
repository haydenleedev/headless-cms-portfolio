import style from "./archivesPageContent.module.scss";
import { handlePreview } from "@agility/nextjs";
import { useEffect, useState } from "react";
import Loader from "../../layout/loader/loader";
import ArchiveCard from "./archiveCard";

// TODO: continue pagination

// here we don't get any data passed in as props as we want to fetch data dynamically with pagination (possibly based on url query parameters, if provided).
const ArchivesPageContent = () => {
  const contentListTypes = [
    {
      title: "Resources",
      model: "resources",
      categories: [
        { title: "e-Books", uid: "ebooks" },
        { title: "Guides", uid: "guides" },
        { title: "Integrations", uid: "integrations" },
        { title: "Reports", uid: "reports" },
        { title: "Webinars", uid: "webinars" },
        { title: "White Papers", uid: "whitepapers" },
      ],
    },
    {
      title: "Press Releases",
      model: "pressrelease",
      categories: [{ title: "Press Releases", uid: "pressreleasearticle" }],
    },
    {
      title: "News",
      model: "newslink",
      categories: [{ title: "News", uid: "newsarticle" }],
    },
  ];

  const [activePageNumber, setActivePageNumber] = useState({
    value: 0,
    offset: 0,
  }); // the currently selected page's number and the associated pagination offset for fetching from agility.
  const [totalPagesCount, setTotalPagesCount] = useState(null); // set the total page count from agility.
  const [totalResultsCount, setTotalResultsCount] = useState(null); // set the total page count from agility.
  const [page, setPage] = useState(null); // items for current page.
  const [activeContentList, setActiveContentList] = useState(
    contentListTypes[2]
  ); // the currently active content list type. default to resources
  const [activeCategory, setActiveCategory] = useState(null); // currently selected category

  const RESULTS_PER_PAGE = 9; // how many cards are shown per page
  const isPreview = handlePreview();
  const apiURL = `https://api.aglty.io/${process.env.AGILITY_GUID}/${
    isPreview ? "preview" : "fetch"
  }/en-us`;
  const APIKey = isPreview
    ? process.env.AGILITY_API_PREVIEW_KEY
    : process.env.AGILITY_API_FETCH_KEY;

  useEffect(() => {
    const getData = async () => {
      // we need to get all results if there is no category selected.
      switch (activeCategory) {
        case null:
          try {
            let promisedLists = activeContentList.categories.map((category) => {
              return fetch(
                `${apiURL}/list/${category.uid}?take=${RESULTS_PER_PAGE}&skip=${activePageNumber.offset}`,
                {
                  headers: {
                    accept: "application/json",
                    APIKey,
                  },
                }
              );
            });
            promisedLists = await Promise.all(promisedLists);
            promisedLists = promisedLists.map((response) => {
              return response.json();
            });
            const lists = await Promise.all(promisedLists);
            setPage(lists[0].items);
            setTotalResultsCount(lists[0].totalCount);
          } catch (error) {
            console.log(error.message);
          }
          break;
        default: {
          try {
            const referenceName = activeContentList.categories.find(
              (category) => category.uid === activeCategory
            );
            const data = await fetch(
              `${apiURL}/list/${referenceName.uid}?take=${RESULTS_PER_PAGE}&skip=${activePageNumber.offset}`,
              {
                headers: {
                  accept: "application/json",
                  APIKey,
                },
              }
            );
            const list = await data.json();
            setPage(list.items);
            setTotalPagesCount(list.totalCount);
          } catch (error) {
            console.log(error.message);
          }
          break;
        }
      }
    };
    if (activeContentList) {
      setActiveCategory(null);
      getData();
    }
  }, [activeContentList, activePageNumber]);

  useEffect(() => {
    let count = Math.floor(totalResultsCount / RESULTS_PER_PAGE);
    if (count > 0) {
      /*       setTotalPagesCount([
        ...Array(count).map((key) => {
          let offset = key * RESULTS_PER_PAGE;
          return { value: key, offset };
        }),
      ]); */
    }
  }, [totalResultsCount]);

  // reset page data when content list type changes
  const handleContentListTypeChange = (model) => {
    if (model.length === 0) return;
    setPage(null);
    const newType = contentListTypes.find((type) => type.model === model);
    setActiveContentList(newType);
  };

  // the different content types use different fields for the card title
  const resolveTitle = (model, fields) => {
    switch (model) {
      case "newslink":
        return fields.articleTitle;
      case "pressrelease":
        return fields.title;
    }
  };

  // the different content types use different fields for the card link
  const resolveLink = (model, fields) => {
    switch (model) {
      case "newslink":
        return fields.link;
      case "pressrelease":
        return { href: fields.slug };
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
              {activeContentList ? (
                <>
                  <option value={activeContentList.model}>
                    {activeContentList.title}
                  </option>
                  {contentListTypes
                    .filter((type) => type.model !== activeContentList.model)
                    .map((type) => (
                      <option key={type.model} value={type.model}>
                        {type.title}
                      </option>
                    ))}
                </>
              ) : (
                <>
                  <option value="">Content type...</option>
                  {contentListTypes.map((type) => (
                    <option key={type.model} value={type.model}>
                      {type.title}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
        </aside>

        <div className={style.contentList}>
          {(page && (
            <div className="columns repeat-3">
              {page.map((item) => (
                <div key={item.contentID}>
                  <ArchiveCard
                    image={item.fields?.image}
                    title={resolveTitle(activeContentList.model, item.fields)}
                    link={resolveLink(activeContentList.model, item.fields)}
                  />
                </div>
              ))}
            </div>
          )) || <Loader />}
        </div>
        <footer className={style.pagination}>
          <button
            className={`reset-button ${style.previousPageButton}`}
          ></button>
          {totalPagesCount &&
            totalPagesCount.map((page) => (
              <div className={page === activePageNumber.value ? "w-600" : ""}>
                <button
                  className={`reset-button ${style.pageButton}`}
                  key={page}
                >
                  {page + 1}
                </button>
              </div>
            ))}
          <button className={`reset-button ${style.nextPageButton}`}></button>
        </footer>
      </nav>
    </section>
  );
};

export default ArchivesPageContent;
