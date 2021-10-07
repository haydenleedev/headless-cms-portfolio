import React, { useState } from "react";
import Link from "next/link";
import style from "./navbar.module.scss";

const MainNavigation = ({ navigationMenu }) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);

  return (
    <ul className={`${style.mainNavigation}`}>
      {navigationMenu.map((primary_menu, index) => (
        <li
          key={`navigation-group-${index}`}
          className={`${style.dropdown}`}
          aria-label="Dropdown menu"
        >
          <Link href="#">
            <a
              className={`${style.navigationItem}`}
              onClick={() => {
                setActiveNavigationItem(`navigation-group-${index}`);
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
                {column.map((navigationItem) => (
                  <>
                    <Link href="#">
                      <a className={`${style.navigationItem}`}>
                        Navigation item
                      </a>
                    </Link>
                    <ul>
                      {navigationItem.navigationItemChildren.map(
                        (third_menu, thirdIndex) => (
                          <li key={thirdIndex}>
                            <Link href="#">
                              <a className={`${style.navigationItem}`}>
                                Navigation item child
                              </a>
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </>
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
