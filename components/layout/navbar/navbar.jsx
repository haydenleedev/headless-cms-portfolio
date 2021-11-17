import logo from "../../../assets/ujet-logo.svg";
import style from "./navbar.module.scss";
import MainNavigation from "./mainNavigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = ({ globalData }) => {
  const { navbar } = globalData.navbar;
  // affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);
  const [pageScrolled, setPageScrolled] = useState(false);
  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position > 10) {
      setPageScrolled(true);
    } else {
      setPageScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <navbar className={`${style.navbar} ${pageScrolled && style.scrolled}`}>
      <nav className="container" role="navigation" aria-label="Main">
        <Link href="/">
          <a
            title="Navigate  to home page"
            aria-label="Navigate to home page"
            className={style.brand}
          >
            <img
              className={style.logo}
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt="Ujet logo"
            />
          </a>
        </Link>
        <button
          aria-label="Toggle main navigation menu"
          title="Toggle main navigation menu"
          className={`${style.navbarToggle} ${
            mainNavigationActive ? style.active : style.closed
          }`}
          onClick={() => {
            setMainNavigationActive(!mainNavigationActive);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <MainNavigation
          active={mainNavigationActive}
          mainNavigation={navbar.fields.mainNavigation}
        />
      </nav>
    </navbar>
  );
};

Navbar.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let contentItem = null;

  try {
    let navbar = await api.getContentList({
      referenceName: "navbarConfiguration",
      languageCode: languageCode,
      contentLinkDepth: 5,
      expandAllContentLinks: true,
    });

    if (navbar && navbar.items && navbar.items.length > 0) {
      contentItem = navbar.items[0];
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
    navbar: contentItem,
  };
};

export default Navbar;
