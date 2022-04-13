import AgilityLink from "../../agilityLink";
import style from "./navbarSecondary.module.scss";

const NavbarSecondary = ({ navbarData, styleClsss }) => {
  return (
    <nav className={`container ${styleClsss} ${style.navbarSecondary}`}>
      {navbarData.fields.navbarSecondary.map((item) => (
        <AgilityLink agilityLink={item.fields.link} key={item.contentID}>
          {item.fields.text}
        </AgilityLink>
      ))}
    </nav>
  );
};

export default NavbarSecondary;
