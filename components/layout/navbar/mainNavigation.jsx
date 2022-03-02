import { useState, useEffect, useRef } from "react";
import style from "./navbar.module.scss";
import { useRouter } from "next/router";
import { isMobile } from "../../../utils/responsivity";
import AgilityLink from "../../agilityLink";
import Search from "./search";

const MainNavigation = ({
  active,
  mainNavigation,
  handleSetMainNavigationActive,
}) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);
  const [searchToggled, setSearchToggled] = useState(false);
  const [dropdownFocus, setDropdownFocus] = useState(false);
  const router = useRouter();
  //Manual sort since something is bugged in Agility item order returned from Agility...
  mainNavigation.forEach((group) => { 
    if (group.fields.columns?.length > 1) {
      group.fields.columns.sort(function (a, b) {
        return b.properties.itemOrder + a.properties.itemOrder;
      });
    }
  });
  mainNavigation.forEach((group) => {
    if (group.fields.columns?.length > 0) {
      group.fields.columns.forEach((column) => {
        column.fields.items.sort(function (a, b) {
          return b.properties.itemOrder + a.properties.itemOrder;
        });
      });
    }
  });
  
  const handleSetSearchToggled = (boolean) => {
    setSearchToggled(boolean);
  };

  const closeActiveNavigationItem = () => {
    setActiveNavigationItem(null)
  }
  const handleNavigationGroupClick = (fields, item) => {
    if (isMobile()) {
      if (item == activeNavigationItem) {
        setActiveNavigationItem(null);
        return;
      }
      if (fields.columns) {
        setActiveNavigationItem(item);
      } else if (fields.mainLink) {
        handleSetMainNavigationActive?.();
        router.push(fields.mainLink.fields.link.href);
      }
    } else if (fields.mainLink) {
      router.push(fields.mainLink.fields.link.href);
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
              : `${style.hasDropdown} ${
                  activeNavigationItem === `navigation-group-${index}`
                    ? style.hasDropdownIsActive
                    : ""
                }`
          }
          ${searchToggled && style.disabled}
          ${!dropdownFocus && style.disabled}
          `}
          aria-label="Toggle dropdown menu"
          aria-controls={
            navigationGroup.fields.columns ? navigationGroup.contentID : null
          }
          onClick={(e) => { e.target.blur(); setDropdownFocus(false) }}
          onMouseEnter={() => setDropdownFocus(true)}
          onFocus={() => setDropdownFocus(true)}
        >
          {/* Group Main Link */}
          <a
            className={`${style.navigationLink}${
              navigationGroup.fields.classes
                ? " " + navigationGroup.fields.classes
                : ""
            }`}
            href={navigationGroup.fields.mainLink?.fields.link.href || "#"}
            aria-label={navigationGroup.fields.mainLink?.fields.link.text}
            label={navigationGroup.fields.mainLink?.fields.link.text}
            onClick={(e) => {
              e.preventDefault();
              handleNavigationGroupClick(
                navigationGroup.fields,
                `navigation-group-${index}`
              );
            }}
          >
            {navigationGroup.fields.mainLink?.fields.internalTitle ||
              navigationGroup.fields.internalTitle}
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
                onClick={() => setDropdownFocus(false)}
              >
                {navigationGroup.fields.columns?.map(
                  (navigationColumn, index) => (
                    <li
                      key={`navigation-column-${index}`}
                      className={style.navigationColumn}
                    >
                      {navigationColumn.fields.links?.map(
                        (navigationItem, index) => (
                          <div
                            className="display-block"
                            key={`navigation-item-${index}`}
                            onClick={() => {
                              handleSetMainNavigationActive?.()
                              setActiveNavigationItem(null)
                            }}
                            role="button"
                          >
                            <AgilityLink
                              agilityLink={navigationItem.fields.link}
                              className={`${style.navigationItem} ${style.navigationLink}`}
                              ariaLabel={navigationItem.fields.link.text}
                              title={navigationItem.fields.link.text}
                            >
                              {navigationItem.fields.internalTitle}
                            </AgilityLink>
                            {/* {navigationItem.fields.navigationItemChildren && (
                              <ul>
                                {navigationItem.fields.navigationItemChildren.map(
                                  (navigationItemChild, index) => (
                                    <li key={`navigation-item-child-${index}`}>
                                      <AgilityLink
                                        agilityLink={
                                          navigationItemChild.fields.link
                                        }
                                        className={`${style.navigationLink}`}
                                        ariaLabel={
                                          navigationItemChild.fields.link.text
                                        }
                                        title={
                                          navigationItemChild.fields.link.text
                                        }
                                      >
                                        {
                                          navigationItemChild.fields
                                            .internalTitle
                                        }
                                      </AgilityLink>
                                    </li>
                                  )
                                )}
                              </ul>
                            )} */}
                          </div>
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
      <Search
        searchToggled={searchToggled}
        handleSetSearchToggled={handleSetSearchToggled}
        handleSetMainNavigationActive={handleSetMainNavigationActive}
      />
    </ul>
  );
};

export default MainNavigation;
