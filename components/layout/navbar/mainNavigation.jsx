import React, { useState } from "react";
import Link from "next/link";
import style from "./navbar.module.scss";

const MainNavigation = ({ active, mainNavigation }) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);

  const handleMenuActivation = (item) => {
    if (item == activeNavigationItem) {
      setActiveNavigationItem(null);
      return;
    }
    setActiveNavigationItem(item);
  };
  return (
    <ul className={`${style.mainNavigation} ${active ? style.mainNavigationActive : style.mainNavigationHidden}`}>
      {mainNavigation?.map((navigationGroup, index) => (
        <li
          key={`navigation-group-${index}`}
          // If no columns, just render a link without dropdown effects
          className={`${!navigationGroup.fields.navigationColumns ? style.noDropdown : style.dropdown}`}
          aria-label="Dropdown menu"
        >
          <Link href="#">
            <a
              className={`${style.navigationLink}`}
              aria-label={"Navigate to page " + navigationGroup.fields.link.text}
              label={"Navigate to page " + navigationGroup.fields.link.text}
              onClick={() => {
                handleMenuActivation(`navigation-group-${index}`);
              }}
            >
              {navigationGroup.fields.link.text}
            </a>
          </Link>
          {navigationGroup.fields.navigationColumns && (
            <ul
              className={`${style.navigationColumns}
              ${activeNavigationItem == `navigation-group-${index}` ? style.dropdownActive : style.dropdownClosed}
            `}
            >
              {navigationGroup.fields.navigationColumns?.map((navigationColumn, index) => (
                <li key={`navigation-column-${index}`} className={style.navigationColumn}>
                  {navigationColumn.fields.navigationItems?.map((navigationItem, index) => (
                    <div className={style.navigationItem} key={`navigation-item-${index}`}>
                      <Link href="#">
                        <a
                          className={`${style.navigationLink}`}
                          aria-label={"Navigate to page " + navigationItem.fields.link.text}
                          label={"Navigate to page " + navigationItem.fields.link.text}
                        >
                          {navigationItem.fields.link.text}
                        </a>
                      </Link>
                      {navigationItem.fields.navigationItemChildren && (
                        <ul>
                          {navigationItem.fields.navigationItemChildren.map((navigationItemChild, index) => (
                            <li key={`navigation-item-child-${index}`}>
                              <Link href="#">
                                <a
                                  className={`${style.navigationLink}`}
                                  aria-label={"Navigate to page " + navigationItemChild.fields.link.text}
                                  label={"Navigate to page " + navigationItemChild.fields.link.text}
                                >
                                  {navigationItemChild.fields.link.text}
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MainNavigation;
