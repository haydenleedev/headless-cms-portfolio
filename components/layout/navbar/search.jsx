import { useEffect, useMemo, useRef, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { renderHTML } from "@agility/nextjs";
import style from "./search.module.scss";
import AgilityLink from "../../agilityLink";
import { useRouter } from "next/router";
import { getAlgoliaHighestResultFormatted } from "../../../utils/convert";

const Search = ({
  searchToggled,
  handleSetSearchToggled,
  handleSetMainNavigationActive,
}) => {
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const [autocompleteState, setAutocompleteState] = useState({});
  const router = useRouter();

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  );

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state);
        },
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: "ujet",
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: "dev_ujet",
                      query,
                      params: {
                        hitsPerPage: 5,
                        highlightPreTag: "<mark>",
                        highlightPostTag: "</mark>",
                        attributesToHighlight: [
                          "title",
                          "description",
                          "headings",
                        ],
                        attributesToSnippet: ["description:15", "headings:15"],
                        snippetEllipsisText: "...",
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.url;
              },
            },
          ];
        },
        debug: false, // disable on prod!!
        placeholder: "Search UJET...",

        onSubmit() {
          submitSearch();
        },
      }),
    []
  );

  useEffect(() => {
    // close search if outside area is clicked
    const handleOutsideSearchClick = (event) => {
      if (searchToggled) {
        const searchBounds = searchRef.current.getBoundingClientRect();

        const mousePos = [event.clientX, event.clientY];
        if (
          mousePos[0] < searchBounds.left ||
          mousePos[0] > searchBounds.right ||
          mousePos[1] < searchBounds.top ||
          mousePos[1] > searchBounds.bottom
        ) {
          handleSetSearchToggled(false);
          inputRef.current.value = "";
        }
      }
    };
    document.addEventListener("click", handleOutsideSearchClick);

    return () => {
      document.removeEventListener("click", handleOutsideSearchClick);
    };
  }, [searchToggled, searchRef.current]);

  const toggleSearch = () => {
    handleSetSearchToggled(!searchToggled);
  };

  const submitSearch = () => {
    router.push(`/search?q=${inputRef.current.value}`);
  };

  return (
    <li className={style.searchContainer}>
      <div className={style.search}>
        <div
          className={`${style.searchInputWrapper} ${
            searchToggled ? style.searchActive : ""
          }`}
          {...autocomplete.getRootProps({})}
        >
          <form
            className={style.searchInput}
            ref={searchRef}
            {...autocomplete.getFormProps({ inputElement: inputRef.current })}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                submitSearch();
              }
            }}
          >
            <input
              type="text"
              aria-label="Search query"
              title="Search query"
              // aria-expanded={searchToggled}
              ref={inputRef}
              id="site-search"
              placeholder="Search..."
              {...autocomplete.getInputProps({})}
            />

            <div aria-disabled></div>
            <button
              aria-label="Hide search input"
              className={`reset-button ${style.clearInput}`}
              onClick={(e) => {
                e.preventDefault();
                handleSetSearchToggled(false);
                autocomplete.setQuery("");
                autocomplete.setIsOpen(false);
              }}
            ></button>
            <button
              aria-label="Search"
              className={`reset-button ${style.searchSubmit}`}
            >
              <span className={style.magnifyingGlass}></span>
            </button>
          </form>
          {/* {autocompleteState.isOpen && ( */}
          <div
            className={`${style.autocomplete} ${
              autocompleteState.isOpen ? "" : style.autocompleteClosed
            }`}
            {...autocomplete.getPanelProps({})}
          >
            {autocompleteState.collections?.map((collection, index) => {
              const { source, items } = collection;
              return (
                <div
                  key={`source-${index}`}
                  className={style.autocompleteSource}
                >
                  {/* {items.length > 0 && ( */}
                  <div className={style.autocompleteSourceTitle}>
                    <p>{source.sourceId.toUpperCase()}</p>
                  </div>
                  {/* )} */}
                  {/* {items.length > 0 && ( */}
                  <ul {...autocomplete.getListProps()}>
                    {items.map((item) => {
                      let description = null;
                      if (
                        item._snippetResult?.content &&
                        item._snippetResult.content.length > 0
                      ) {
                        let snippetBlock = item._snippetResult.content.find(
                          (block) => {
                            return block.data.text.matchLevel === "full";
                          }
                        );

                        if (snippetBlock) {
                          description = snippetBlock.data.text.value;
                        }
                      }

                      if (!description) {
                        description = getAlgoliaHighestResultFormatted(
                          item._snippetResult
                        );
                      }

                      return (
                        <li
                          key={item.objectID}
                          className={style.autocompleteEntry}
                          {...autocomplete.getItemProps({
                            item,
                            source,
                          })}
                          onClick={() => handleSetMainNavigationActive?.()}
                          role="option"
                        >
                          <AgilityLink agilityLink={{ href: item.path }}>
                            <p
                              className={style.autocompleteEntryTitle}
                              dangerouslySetInnerHTML={renderHTML(
                                item._highlightResult.title.value
                              )}
                            ></p>

                            {description && (
                              <p
                                className={style.autocompleteEntryDescription}
                                dangerouslySetInnerHTML={renderHTML(
                                  description
                                )}
                              ></p>
                            )}
                          </AgilityLink>
                        </li>
                      );
                    })}
                  </ul>
                  {/* )} */}
                </div>
              );
            })}
          </div>
          {/* )} */}
        </div>
        <button
          aria-label="Site search button"
          // aria-controls="site-search"
          className={`reset-button ${style.searchButton} ${
            searchToggled ? style.searchButtonHidden : ""
          }`}
          onClick={toggleSearch}
        >
          <span className={style.magnifyingGlass}></span>
        </button>
      </div>
    </li>
  );
};

export default Search;
