import style from "./navbar.module.scss";
import AgilityLink from "../../agilityLink";
import { useState } from "react";
import { useRouter } from "next/router";
import { isMobile } from "../../../utils/responsivity";

export const NavigationGroup = ({
  navigationGroup,
  index,
  handleSetMainNavigationActive,
  searchToggled,
  secondaryNavigation,
  activeNavigationItem,
  setActiveNavigationItem
}) => {
  const router = useRouter();
  const [dropdownFocus, setDropdownFocus] = useState(false);
  const handleNavigationGroupClick = (fields, item) => {
    if (isMobile()) {
      if (item == activeNavigationItem) {
          console.log("nulling")
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
    <li
      // If no columns, just render a link without dropdown effects
      className={`${
        secondaryNavigation ? style.navbarSecondaryMobileLinks : ""
      } ${
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
      onClick={(e) => {
        e.target.blur();
        setDropdownFocus(false);
      }}
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
            {navigationGroup.fields.columns?.map((navigationColumn, index) => (
              <li
                key={`navigation-column-${index}`}
                className={style.navigationColumn}
              >
                {navigationColumn.fields.links?.map((navigationItem, index) => (
                  <div
                    className="display-block"
                    key={`navigation-item-${index}`}
                    onClick={() => {
                      handleSetMainNavigationActive?.();
                      setActiveNavigationItem(null);
                    }}
                    role="button"
                  >
                    <AgilityLink
                      agilityLink={navigationItem.fields.link}
                      className={`${style.navigationItem} ${style.navigationLink}`}
                      ariaLabel={navigationItem.fields.link.text}
                      title={navigationItem.fields.link.text}
                    >
                      {navigationItem.fields.internalTitle ||
                        navigationItem.fields.text}
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
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
};
