import style from "./archivesPageContent.module.scss";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  sortContentListByDate,
  resolveCategory,
  resolveLink,
} from "../../../utils/convert";
import { boolean } from "../../../utils/validation";
const ArchivesNavigation = dynamic(() => import("./archivesNavigation"));
const GenericCard = dynamic(() => import("../../genericCard/genericCard"));
const HighlightSection = dynamic(() => import("./highlightSection"));

const ArchivesPageContentBlock = ({ fields, archivesPageData }) => {
  const highlightedResource = fields.highlightedResource;
  const highlightedNewsArticle = fields.highlightedNewsArticle;
  const highlightedPressRelease = fields.highlightedPressRelease;
  const { query } = useRouter();
  const [activePageNumber, setActivePageNumber] = useState(0); // number of the current page.
  const [totalPagesCount, setTotalPagesCount] = useState(null); // total count of pages.
  const [currentOffset, setCurrentOffset] = useState(0); // current offset in the active content list.
  const [page, setPage] = useState(null); // the contents of current page.
  const [activeContentList, setActiveContentList] = useState(null); // these are their own states because it makes handing multiple categories easier.
  const [activeContentType, setActiveContentType] = useState(null); // these are their own states because it makes handing multiple categories easier.
  const [contentCategories, setContentCategories] = useState(null); // these are their own states because it makes handing multiple categories easier.
  const [activeCategories, setActiveCategories] = useState([]); // currently selected categories.
  const [mobileCategoriesVisible, setMobileCategoriesVisible] = useState(false);
  const [contentListTypes, setContentListTypes] = useState([]); // the 3 different content types: news, press releases and resources.
  const allCategoriesCheckboxRef = useRef();
  const resourceCategoryCheckboxRefs = useRef([]);

  const PER_PAGE = 9; // how many cards are shown per page

  // initial load: check if query params are provided in the url, set active content type and categories accordingly
  useEffect(() => {
    setContentListTypes(Array.from(archivesPageData));
  }, []);

  useEffect(() => {
    if (contentListTypes.length > 0) {
      if (query.type) {
        let queriedType = contentListTypes.find(
          (type) => type.id === query.type
        );
        const categories = query?.categories?.split(",");
        setActiveContentType(queriedType?.id);
        setActiveContentList(queriedType?.content);
        setContentCategories(queriedType?.categories);
        if (categories) {
          setActiveCategories(categories);
        }
      } else {
        setActiveContentType(contentListTypes[0].id);
        setActiveContentList(contentListTypes[0].content);
        setContentCategories(contentListTypes[0].categories);
      }
    }
  }, [contentListTypes]);
  // reset offset and when active content list changes, update total pages count and set the content of the current page if the list is not null.
  useEffect(() => {
    setCurrentOffset(0);
    setActivePageNumber(0);
    if (activeContentList) {
      setTotalPagesCount(Math.ceil(activeContentList.length / PER_PAGE));
      setPage(activeContentList.slice(currentOffset, currentOffset + PER_PAGE));
    }
  }, [activeContentList]);

  // reset offset and when active content type changes (eg. from resources to news)
  useEffect(() => {
    setCurrentOffset(0);
    setActivePageNumber(0);
    if (activeContentType == "resources") {
      let newContentList = getSortedContentByActiveCategories();
      setActiveContentList(newContentList);
      if (activeCategories.length > 0) {
        // Check the checkboxes that correspond to the selected categories
        resourceCategoryCheckboxRefs.current.forEach((ref) => {
          if (activeCategories.includes(ref.id.split("Checkbox")[0])) {
            ref.checked = true;
          } else {
            ref.checked = false;
          }
        });
        allCategoriesCheckboxRef.current.checked = false;
        allCategoriesCheckboxRef.current.disabled = false;
      }
    }
  }, [activeContentType]);

  // if active categories changes and there are at least one category on the list, reset offset and update the active content list based on the selected categories.
  useEffect(() => {
    if (activeCategories.length > 0) {
      if (
        contentCategories &&
        activeCategories.length == Object.keys(contentCategories).length
      ) {
        setActiveCategories([]);
      }
      setCurrentOffset(0);
      let newContentList = getSortedContentByActiveCategories();
      setActiveContentList(newContentList);
      if (allCategoriesCheckboxRef.current.checked) {
        allCategoriesCheckboxRef.current.checked = false;
        allCategoriesCheckboxRef.current.disabled = false;
      }
      // if there are no selected categories, just set the content list to include all categories (the default content for selected content type).
    } else if (activeContentType) {
      setCurrentOffset(0);
      let list = contentListTypes.find(
        (type) => type.id === activeContentType
      ).content;
      if (list.length !== activeContentList) {
        setActiveContentList(list);
      }
      resourceCategoryCheckboxRefs.current.forEach((ref) => {
        ref.checked = false;
      });
      allCategoriesCheckboxRef.current.checked = true;
      allCategoriesCheckboxRef.current.disabled = true;
    }
  }, [activeCategories]);

  // update the page content when current offset changes.
  useEffect(() => {
    if (activeCategories && activeContentList)
      setPage(activeContentList.slice(currentOffset, currentOffset + PER_PAGE));
    else if (activeContentList)
      setPage(activeContentList.slice(currentOffset, currentOffset + PER_PAGE));
  }, [currentOffset]);

  // returns a sorted content list with the contents of selected categories.
  const getSortedContentByActiveCategories = () => {
    let newContentList = [];
    if (activeCategories && contentCategories) {
      if (activeCategories.length > 0) {
        activeCategories.forEach((category) => {
          newContentList = [
            ...newContentList,
            ...contentCategories[category].content,
          ];
        });
      } else {
        Object.keys(contentCategories).forEach((category) => {
          newContentList = [
            ...newContentList,
            ...contentCategories[category].content,
          ];
        });
      }
      return sortContentListByDate(newContentList);
    } else {
      return activeContentList;
    }
  };
  // reset page data when content list type changes
  const handleContentListTypeChange = (id) => {
    if (id.length === 0) return;
    setPage(null);
    const newType = contentListTypes.find((type) => type.id === id);
    setActiveContentType(newType.id);
    setContentCategories(newType.categories);
    setActiveContentList(newType.content);
  };

  // when some category is selected update the active categories list accordingly.
  const handleCategoryChange = (event, category) => {
    if (!event.target.checked) {
      let newCategories = activeCategories.filter(
        (active) => active !== category
      );
      setActiveCategories(newCategories);
    } else {
      let newCategories = [...activeCategories, category];
      setActiveCategories(newCategories);
    }
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

  const handleSetActivePageNumber = (pageNumber) => {
    setActivePageNumber(pageNumber);
  };

  const handleSetCurrentOffset = (offset) => {
    setCurrentOffset(offset);
  };

  return (
    <>
      {highlightedResource && activeContentType == "resources" && (
        <HighlightSection
          highlightContent={highlightedResource}
          headingText="RESOURCES"
        />
      )}
      {highlightedNewsArticle && activeContentType == "news" && (
        <HighlightSection
          highlightContent={highlightedNewsArticle}
          headingText="NEWS"
        />
      )}
      {highlightedPressRelease && activeContentType == "pressreleases" && (
        <HighlightSection
          highlightContent={highlightedPressRelease}
          headingText="PRESS RELEASES"
        />
      )}
      <section className={`section ${style.archivesPageContent}`}>
        <nav
          className={`container ${style.navigationMenu}`}
          aria-label="news, press releases and resources navigation"
        >
          <aside className={`${style.filterPanel}`}>
            <label htmlFor="select-content-type">
              Content type
              <div className={style.contentTypeSelectWrapper}>
                <select
                  id="select-content-type"
                  value={activeContentType}
                  onChange={(event) =>
                    handleContentListTypeChange(event.target.value)
                  }
                >
                  {activeContentList && (
                    <>
                      {contentListTypes?.map?.((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </label>
            {contentCategories && (
              <fieldset>
                <legend className={style.desktopCategoryLegend}>
                  Categories
                </legend>
                <button
                  className={`${style.mobileCategoryToggle}`}
                  aria-label="Toggle category selector"
                  onClick={() => {
                    setMobileCategoriesVisible(!mobileCategoriesVisible);
                  }}
                >
                  <div>
                    <legend>Categories</legend>
                    <div
                      className={`${style.chevron} ${
                        mobileCategoriesVisible ? style.flipped : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`${style.categoryCheckboxes} ${
                    mobileCategoriesVisible ? "" : style.hidden
                  }`}
                >
                  {Object.entries(contentCategories).map(
                    ([key, category], i) => (
                      <label key={key + "Checkbox"} htmlFor={key + "Checkbox"}>
                        <input
                          type="checkbox"
                          id={key + "Checkbox"}
                          ref={(elem) =>
                            (resourceCategoryCheckboxRefs.current[i] = elem)
                          }
                          onChange={(event) => handleCategoryChange(event, key)}
                        />
                        {category.title}
                      </label>
                    )
                  )}
                  <label htmlFor="allCategoriesCheckbox">
                    <input
                      type="checkbox"
                      id="allCategoriesCheckbox"
                      defaultChecked={true}
                      disabled={true}
                      ref={allCategoriesCheckboxRef}
                      onChange={(e) => {
                        if (e.target.checked) {
                          e.target.disabled = true;
                          setActiveCategories([]);
                        }
                      }}
                    />
                    Show all categories
                  </label>
                </div>
              </fieldset>
            )}
          </aside>

          <div className={style.contentList}>
            {page && (
              <div className="columns repeat-3">
                {page
                  .filter(
                    (item) =>
                      boolean(item.fields?.hideFromResourceHome) == false
                  )
                  .map((item) => (
                    <>
                      <GenericCard
                        key={item.contentID}
                        image={item.fields?.image}
                        title={resolveTitle(activeContentType, item.fields)}
                        ariaTitle={resolveTitle(activeContentType, item.fields)}
                        newsSite={
                          item.fields.title && activeContentType === "news"
                            ? item.fields.title
                            : null
                        }
                        link={resolveLink(
                          item.properties.referenceName,
                          item.fields
                        )}
                        date={
                          activeContentType !== "resources"
                            ? item.fields.date
                            : null
                        }
                        category={
                          item.fields?.cardCategoryTitle ||
                          resolveCategory(item.properties.referenceName)
                        }
                        podcast={
                          activeContentType === "news" && item.fields.podcast
                            ? item.fields.podcast
                            : null
                        }
                      />
                    </>
                  ))}
              </div>
            )}
          </div>
          {/* Display the page numbers. truncate if there's a lot of pages*/}
          <ArchivesNavigation
            activePageNumber={activePageNumber}
            totalPagesCount={totalPagesCount}
            previousPage={previousPage}
            nextPage={nextPage}
            handleSetActivePageNumber={handleSetActivePageNumber}
            handleSetCurrentOffset={handleSetCurrentOffset}
            perPage={PER_PAGE}
          />
        </nav>
      </section>
    </>
  );
};

export default ArchivesPageContentBlock;
