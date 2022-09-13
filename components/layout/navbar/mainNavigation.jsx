import { useState, Fragment } from "react";
import style from "./navbar.module.scss";
import Search from "./search";
import { NavigationGroup } from "./navigationGroup";

const MainNavigation = ({
  active,
  mainNavigation,
  handleSetMainNavigationActive,
  navbarData,
}) => {
  const [searchToggled, setSearchToggled] = useState(false);
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);

  //Manual sort since something is bugged in Agility item order returned from Agility...
  mainNavigation.forEach((group) => {
    if (group.fields.columns?.length > 1) {
      group.fields.columns.sort(function (a, b) {
        return a.properties.itemOrder - b.properties.itemOrder;
      });
    }
  });
  mainNavigation.forEach((group) => {
    if (group.fields.columns?.length > 0) {
      group.fields.columns.forEach((column) => {
        column.fields.items?.sort(function (a, b) {
          return a.properties.itemOrder - b.properties.itemOrder;
        });
      });
    }
  });

  const handleSetSearchToggled = (boolean) => {
    setSearchToggled(boolean);
  };

  const secondaryNavDropdownData = {
    fields: {
      columns: [{ fields: { links: navbarData.fields.navbarSecondary } }],
      mainLink: {
        fields: {
          internalTitle: navbarData.fields.navbarSecondaryDropdownText,
          link: {},
        },
      },
    },
  };

  return (
    <ul
      className={`${style.mainNavigation} ${
        active ? style.mainNavigationActive : style.mainNavigationHidden
      }`}
    >
      {mainNavigation?.map((navigationGroup, index) => (
        <Fragment key={`navItem${index}`}>
          {index == mainNavigation.length - 1 && (
            // Render the secondary navigation links before the request a demo button
            <>
              {navbarData.fields.navbarSecondaryMobileDropdown ? (
                <NavigationGroup
                  navigationGroup={secondaryNavDropdownData}
                  index={index}
                  mainNavigation={mainNavigation}
                  activeNavigationItem={activeNavigationItem}
                  setActiveNavigationItem={setActiveNavigationItem}
                  handleSetMainNavigationActive={handleSetMainNavigationActive}
                  searchToggled={searchToggled}
                  secondaryNavigation
                />
              ) : (
                <>
                  {navbarData.fields.navbarSecondary?.map((link, i) => {
                    const linkData = {
                      fields: {
                        columns: [{ fields: { links: link.fields.navbarSecondarySublist } }],
                        mainLink: {
                          fields: {
                            internalTitle: link.fields.text,
                            link: link.fields.link,
                          },
                        },
                      },
                    };
                    return (
                      <NavigationGroup
                        key={`secondaryNavItem${i}`}
                        navigationGroup={linkData}
                        index={index + i}
                        mainNavigation={mainNavigation}
                        activeNavigationItem={activeNavigationItem}
                        setActiveNavigationItem={setActiveNavigationItem}
                        handleSetMainNavigationActive={
                          handleSetMainNavigationActive
                        }
                        searchToggled={searchToggled}
                        secondaryNavigation
                      />
                    );
                  })}
                </>
              )}
            </>
          )}
          <NavigationGroup
            navigationGroup={navigationGroup}
            index={
              index == mainNavigation.length - 1
                ? navbarData.fields.navbarSecondaryMobileDropdown
                  ? index + 1
                  : index + navbarData.fields.navbarSecondary.length
                : index
            }
            mainNavigation={mainNavigation}
            activeNavigationItem={activeNavigationItem}
            setActiveNavigationItem={setActiveNavigationItem}
            handleSetMainNavigationActive={handleSetMainNavigationActive}
            searchToggled={searchToggled}
          />
        </Fragment>
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
