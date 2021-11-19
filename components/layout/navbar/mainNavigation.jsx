import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import style from "./navbar.module.scss";
import { useRouter } from "next/router";
import { isMobile } from "../../../utils/responsivity";

const MainNavigation = ({ active, mainNavigation }) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);
  const [searchToggled, setSearchToggled] = useState(false);
  const router = useRouter();
  const searchInput = useRef(null);
  const onFocus = () => {};
  const onBlur = () => {
    setSearchToggled(false);
  };

  // useEffect(() => {}, [searchToggled]);

  function handleToggleSearch() {
    setSearchToggled(true);
    searchInput.current.focus();
  }

  const handleNavigationGroupClick = (href, item) => {
    if (isMobile()) {
      if (item == activeNavigationItem) {
        setActiveNavigationItem(null);
        return;
      }
      setActiveNavigationItem(item);
    } else {
      router.push(href);
    }
  };

  return (
    <ul
      className={`${style.mainNavigation} ${
        active ? style.mainNavigationActive : style.mainNavigationHidden
      }`}
    >
      {mainNavigation?.map((navigationGroup, index) => (
        <li
          key={`navigation-group-${index}`}
          // If no columns, just render a link without dropdown effects
          className={`${
            !navigationGroup.fields.columns
              ? style.noDropdown
              : style.hasDropdown
          }
          ${searchToggled && style.disabled}
          `}
          aria-label="Toggle dropdown menu"
          aria-controls={navigationGroup.contentID}
        >
          {/* Group Main Link */}
          <a
            className={`${style.navigationLink}`}
            aria-label={navigationGroup.fields.mainLink?.fields?.link.text}
            label={navigationGroup.fields.mainLink?.fields?.link.text}
            onClick={(e) => {
              e.preventDefault();
              handleNavigationGroupClick(
                navigationGroup.fields.mainLink?.fields?.link.href,
                `navigation-group-${index}`
              );
            }}
          >
            {navigationGroup.fields.mainLink?.fields?.internalTitle}
          </a>
          {navigationGroup.fields.columns && (
            // Dropdown
            <>
              <ul
                id={navigationGroup.contentID}
                className={`${style.navigationColumns} ${
                  activeNavigationItem == `navigation-group-${index}`
                    ? style.dropdownActive
                    : style.dropdownClosed
                } 
                `}
              >
                {navigationGroup.fields.columns?.map(
                  (navigationColumn, index) => (
                    <li
                      key={`navigation-column-${index}`}
                      className={style.navigationColumn}
                    >
                      {navigationColumn.fields.items?.map(
                        (navigationItem, index) => (
                          <>
                            <Link
                              href={
                                navigationItem.fields.mainLink.fields.link.href
                              }
                              className={style.navigationItem}
                              key={`navigation-item-${index}`}
                            >
                              <a
                                className={`${style.navigationLink}`}
                                aria-label={
                                  navigationItem.fields.mainLink.fields.link
                                    .text
                                }
                                label={
                                  navigationItem.fields.mainLink.fields.link
                                    .text
                                }
                              >
                                {
                                  navigationItem.fields.mainLink.fields
                                    .internalTitle
                                }
                              </a>
                            </Link>
                            {navigationItem.fields.navigationItemChildren && (
                              <ul>
                                {navigationItem.fields.navigationItemChildren.map(
                                  (navigationItemChild, index) => (
                                    <li key={`navigation-item-child-${index}`}>
                                      <Link
                                        href={
                                          navigationItemChild.fields.link.href
                                        }
                                      >
                                        <a
                                          className={`${style.navigationLink}`}
                                          aria-label={
                                            navigationItemChild.fields.link.text
                                          }
                                          label={
                                            navigationItemChild.fields.link.text
                                          }
                                        >
                                          {
                                            navigationItemChild.fields
                                              .internalTitle
                                          }
                                        </a>
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </>
                        )
                      )}
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </li>
      ))}
      <div className={style.searchContainer}>
        <li className={style.search}>
          <input
            type="text"
            aria-label="Search query"
            title="Search query"
            aria-expanded={searchToggled}
            ref={searchInput}
            id="site-search"
            placeholder="Search..."
            className={`${style.searchInput} ${searchToggled && style.active}`}
            onFocus={() => {
              onFocus();
            }}
            onBlur={() => {
              onBlur();
            }}
          ></input>
          <button
            aria-controls="site-search"
            className={style.searchButton}
            onClick={() => {
              handleToggleSearch();
            }}
          >
            <span className={style.magnifyingGlass}></span>
          </button>
          {/* {searchToggled && <button className={style.closeInput}>
          </button>} */}
        </li>
      </div>
    </ul>
  );
};

export default MainNavigation;
