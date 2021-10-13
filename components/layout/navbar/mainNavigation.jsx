import React, { useState } from "react";
import Link from "next/link";
import style from "./navbar.module.scss";

const MainNavigation = ({ active, navigationMenu }) => {

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
      {navigationMenu.map((primary_menu, index) => (
        <li
          key={`navigation-group-${index}`}
          className={`${style.dropdown}`}
          aria-label="Dropdown menu"
        >
          <Link href="#">
            <a
              className={`${style.navigationLink}`}
              onClick={() => {
                handleMenuActivation(`navigation-group-${index}`);
              }}
            >
              navgrp
            </a>
          </Link>
          {/* TODO: Prototyping nav columns */}
          <ul
            className={`${style.navigationColumns}
              ${
                activeNavigationItem == `navigation-group-${index}`
                  ? style.dropdownActive
                  : style.dropdownClosed
              }
            `}
          >
            {primary_menu.columns.map((column, index) => (
              <li
                key={`navigation-column-${index}`}
                className={style.navigationColumn}
              >
                {column.map((navigationItem, index) => (
                  <div className={style.navigationItem} key={`navigation-item-${index}`}>
                    <Link href="#">
                      <a className={`${style.navigationLink}`}>
                        Navigation item
                      </a>
                    </Link>
                    {navigationItem.navigationItemChildren && (
                      <ul>
                        {navigationItem.navigationItemChildren.map(
                          (third_menu, thirdIndex) => (
                            <li key={thirdIndex}>
                              <Link href="#">
                                <a className={`${style.navigationLink}`}>
                                  Navigation item child
                                </a>
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default MainNavigation;
