import React, { useState } from "react";
import Link from "next/link";
import style from "./navbar.module.scss";
import { useRouter } from "next/router";
import { isMobile } from "../../../utils/responsivity";

const MainNavigation = ({ active, mainNavigation }) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);
  const router = useRouter();
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
          }`}
          aria-label="Dropdown menu"
        >
          {/* Group Main Link */}
          <a
            className={`${style.navigationLink}`}
            aria-label={
              "Navigate to " + navigationGroup.fields.mainLink.fields.link.text
            }
            label={
              "Navigate to " + navigationGroup.fields.mainLink.fields.link.text
            }
            onClick={(e) => {
              e.preventDefault();
              handleNavigationGroupClick(
                navigationGroup.fields.mainLink.fields.link.href,
                `navigation-group-${index}`
              );
            }}
          >
            {navigationGroup.fields.mainLink.fields.link.text}
          </a>
          {navigationGroup.fields.columns && (
            // Dropdown
            <>
              <span aria-disabled className={style.dropdownPointer}></span>
              <ul
                className={`${style.navigationColumns} ${
                  activeNavigationItem == `navigation-group-${index}`
                    ? style.dropdownActive
                    : style.dropdownClosed
                }`}
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
                                  "Navigate to page " +
                                  navigationItem.fields.mainLink.fields.link
                                    .text
                                }
                                label={
                                  "Navigate to page " +
                                  navigationItem.fields.mainLink.fields.link
                                    .text
                                }
                              >
                                {
                                  navigationItem.fields.mainLink.fields.link
                                    .text
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
                                            "Navigate to page " +
                                            navigationItemChild.fields.link.text
                                          }
                                          label={
                                            "Navigate to page " +
                                            navigationItemChild.fields.link.text
                                          }
                                        >
                                          {navigationItemChild.fields.link.text}
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
    </ul>
  );
};

export default MainNavigation;
