import { Fragment, useState } from "react";
import AgilityLink from "../../agilityLink";
import { NavigationGroup } from "../navbar/navigationGroup";
import style from "./navbarSecondary.module.scss";

const NavbarSecondary = ({
  active,
  secondaryNavigation,
  handleSetMainNavigationActive,
  styleClass,
}) => {
  const [activeNavigationItem, setActiveNavigationItem] = useState(null);

  //Manual sort since something is bugged in Agility item order returned from Agility...
  secondaryNavigation.forEach((group) => {
    if (group.fields.columns?.length > 1) {
      group.fields.columns.sort(function (a, b) {
        return a.properties.itemOrder - b.properties.itemOrder;
      });
    }
  });
  secondaryNavigation.forEach((group) => {
    if (group.fields.columns?.length > 0) {
      group.fields.columns.forEach((column) => {
        column.fields.items?.sort(function (a, b) {
          return a.properties.itemOrder - b.properties.itemOrder;
        });
      });
    }
  });

  const handleSetActiveNavigationItem = (item) => {
    setActiveNavigationItem(item);
  };
  return (
    <nav
      className={`container ${styleClass} ${style.navbarSecondary}`}
      id="globalSecondaryNav"
    >
      <ul
        className={`${style.navbarSecondaryV2} ${
          active ? style.navbarSecondaryV2Active : style.navbarSecondaryV2Hidden
        }`}
      >
        {secondaryNavigation?.map((navigationGroup, index) => (
          <Fragment key={`navItem${index}`}>
            <NavigationGroup
              navigationGroup={navigationGroup}
              index={index}
              mainNavigation={secondaryNavigation}
              activeNavigationItem={activeNavigationItem}
              setActiveNavigationItem={handleSetActiveNavigationItem}
              handleSetMainNavigationActive={handleSetMainNavigationActive}
              isSecondary
            />
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarSecondary;
