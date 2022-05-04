import logo from "../../../assets/ujet-logo.svg";
import style from "./brandNavbar.module.scss";
import { sleep } from "../../../utils/generic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import GlobalContext from "../../../context";
import MainNavigation from "../navbar/mainNavigation";
const BrandNavbar = ({ globalData }) => {
  const { brandNavbar } = globalData.brandNavbar;
  const copyrightText = globalData.footer.data.fields.copyrightText;
  const router = useRouter();
  //Affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);

  const closeMenu = () => {
    setMainNavigationActive(false);
  };
  const handleSetMainNavigationActive = () => {
    setMainNavigationActive(!mainNavigationActive);
  };
  return (
    <header className={`${style.navbar} `}>
      <nav className={style.nav} role="navigation" aria-label="Main">
        <button
          aria-label="Toggle main navigation menu"
          title="Toggle main navigation menu"
          onClick={() => handleSetMainNavigationActive()}
          className={`${style.navbarToggle}`}
        >
          <span></span>
          <span></span>
        </button>
        <div className={style.logoContainer}>
          <Link href="/brand/home">
            <a
              title="Navigate  to home page"
              aria-label="Navigate to home page"
              className={style.brand}
            >
              <img
                className={style.logo}
                src={logo.src}
                width="100%"
                height="100%"
                alt="Ujet logo"
              />
            </a>
          </Link>
        </div>
        <div
          className={`${style.mainNavigationContainer} ${
            mainNavigationActive
              ? style.mainNavigationContainerActive
              : style.mainNavigationContainerHidden
          }`}
        >
          <ul className={style.mainNavigation}>
            {brandNavbar.fields.mainNavigation.length > 0 &&
              brandNavbar.fields.mainNavigation.map((item, index) => {
                return (
                  <li key={`navitem${index}`}>
                  <Link
                    href={item.fields.mainLink.fields.link.href}
                    className={style.navLink}
                  >
                    <a onClick={closeMenu}>
                      {item.fields.mainLink.fields.link.text}
                    </a>
                  </Link>
                  </li>
                );
              })}
            <p className={style.copyright}>{copyrightText}</p>
          </ul>
        </div>
        <div className={style.buttonContainer}>
          <Link href="/">Questions?</Link>
        </div>
      </nav>
    </header>
  );
};

BrandNavbar.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let navbarGroups = null;

  try {
    let brandNavbar = await api.getContentList({
      referenceName: "BrandNavbarConfiguration",
      languageCode: languageCode,
      contentLinkDepth: 5,
      expandAllContentLinks: true,
    });

    if (brandNavbar && brandNavbar.items && brandNavbar.items.length > 0) {
      navbarGroups = brandNavbar.items[0];
    } else {
      return null;
    }
  } catch (error) {
    if (console)
      console.error("Could not load site navbar configuration.", error);
    return null;
  }

  // return clean object...
  return {
    brandNavbar: navbarGroups,
  };
};

export default BrandNavbar;
