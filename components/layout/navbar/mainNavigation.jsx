import React, { useState } from "react";
import Link from "next/link";
import style from "./navbar.module.scss";
import { useRouter } from "next/router";

const MainNavigation = ({ active, mainNavigation }) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);
  const router = useRouter()
  const handleNavigationGroupClick = (href, item) => {
    /** Have to match this to scss mixing touch breakpoint, since there's no other way to
    disable dropdown navigation with css in mobile without creating duplicate DOM elements...
    */
    if (window.innerWidth < 768) {
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
            !navigationGroup.fields.navigationColumns
              ? style.noDropdown
              : style.hasDropdown
          }`}
          aria-label="Dropdown menu"
        >
          <a
            className={`${style.navigationLink}`}
            aria-label={"Navigate to " + navigationGroup.fields.link.text}
            label={"Navigate to " + navigationGroup.fields.link.text}
            onClick={(e) => {
              e.preventDefault();
              handleNavigationGroupClick(navigationGroup.fields.link.href, `navigation-group-${index}`);
            }}
          >
            {navigationGroup.fields.link.text}
          </a>
          {navigationGroup.fields.navigationColumns && (
            <ul
              className={`${style.navigationColumns}
              ${
                activeNavigationItem == `navigation-group-${index}`
                  ? style.dropdownActive
                  : style.dropdownClosed
              }
            `}
            >
              {navigationGroup.fields.navigationColumns?.map(
                (navigationColumn, index) => (
                  <li
                    key={`navigation-column-${index}`}
                    className={style.navigationColumn}
                  >
                    {navigationColumn.fields.navigationItems?.map(
                      (navigationItem, index) => (
                        <div
                          className={style.navigationItem}
                          key={`navigation-item-${index}`}
                        >
                          <Link href="#">
                            <a
                              className={`${style.navigationLink}`}
                              aria-label={
                                "Navigate to page " +
                                navigationItem.fields.link.text
                              }
                              label={
                                "Navigate to page " +
                                navigationItem.fields.link.text
                              }
                            >
                              {navigationItem.fields.link.text}
                            </a>
                          </Link>
                          {navigationItem.fields.navigationItemChildren && (
                            <ul>
                              {navigationItem.fields.navigationItemChildren.map(
                                (navigationItemChild, index) => (
                                  <li key={`navigation-item-child-${index}`}>
                                    <Link href="#">
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
                        </div>
                      )
                    )}
                  </li>
                )
              )}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MainNavigation;
