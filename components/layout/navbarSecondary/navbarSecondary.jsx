import AgilityLink from "../../agilityLink";
import style from "./navbarSecondary.module.scss";

const NavbarSecondary = ({ navbarData }) => {
  return (
    <nav className={`container navbarSecondary ${style.navbarSecondary}`}>
      {navbarData.fields.navbarSecondary.map((item) => (
        <AgilityLink agilityLink={item.fields.link} key={item.contentID}>
          <p>{item.fields.text}</p>
        </AgilityLink>
      ))}
    </nav>
  );
};

export default NavbarSecondary;
