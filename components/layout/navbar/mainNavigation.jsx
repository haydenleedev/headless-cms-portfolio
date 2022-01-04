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
  const router = useRouter();
  //Manual sort since something is bugged in Agility item order returned from Agility...
  // mainNavigation.forEach((group) => {
  //   if (group.fields.columns?.length > 0) {
  //     group.fields.columns.forEach((column) => {
  //       column.fields.items.sort(function (a, b) {
  //         return a.properties.itemOrder - b.properties.itemOrder;
  //       });
  //     });
  //   }
  // });
  const handleSetSearchToggled = (boolean) => {
    setSearchToggled(boolean);
  };
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
          `}
          aria-label="Toggle dropdown menu"
          aria-controls={
            navigationGroup.fields.columns ? navigationGroup.contentID : null
          }
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
                            onClick={() => handleSetMainNavigationActive?.()}
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
