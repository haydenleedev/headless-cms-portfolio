import AgilityLink from "../../agilityLink";
import style from "./navbarSecondary.module.scss";

const NavbarSecondary = ({ navbarData, styleClsss }) => {
  return (
    <nav className={`container ${styleClsss} ${style.navbarSecondary}`}>
      {navbarData.fields.navbarSecondary.map((item) => (
        <AgilityLink
          className={item.fields?.navbarSecondarySublist && style.hasSublist}
          agilityLink={item.fields.link}
          key={item.contentID}
        >
          {item.fields.text}
          {item.fields?.navbarSecondarySublist &&
            <ul className={style.sublist}>
              {item.fields?.navbarSecondarySublist.map((subItem, index) => (
                <li key={index}>
                  <AgilityLink agilityLink={subItem.fields.link} key={subItem.contentID}>
                    {subItem.fields.text}
                  </AgilityLink>
                </li>
              ))}
            </ul>
          }
        </AgilityLink>
      ))}
    </nav>
  );
};

export default NavbarSecondary;
