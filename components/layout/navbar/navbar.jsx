import logo from "../../../assets/ujet-logo.svg";
import style from "./navbar.module.scss";
import MainNavigation from "./mainNavigation";
import NavbarSecondary from "../navbarSecondary/navbarSecondary";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import GlobalContext from "../../../context";

const Navbar = ({ globalData }) => {
  const { navbar } = globalData.navbar;
  const { navbarRef } = useContext(GlobalContext);
  const router = useRouter();
  // affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);
  const [pageScrolled, setPageScrolled] = useState(false);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [hidden, setHidden] = useState(false);
  let throttling = false;

  useEffect(() => {
    const handleTransparency = () => {
      return new Promise((resolve) => {
        // check if TransparentizeNavbar module is placed on top of the Agility page module list.
        // promise is resolved to true if the module is detected. Otherwise resolves to false
        let firstSection;
        const sections = document
          .getElementById("__next")
          ?.querySelector?.("main").children;
        for (let i = 0; i < sections.length; i++) {
          // Avoid selecting Hidden H1
          if (!sections[i].getAttribute("data-hidden-h1")) {
            firstSection = sections[i];
            break;
          }
        }
        if (firstSection?.getAttribute("data-navbar-hidden")) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        if (
          // transparency is dismissed with touch screen sizes.
          firstSection?.getAttribute("data-transparent-navbar") &&
          window.innerWidth >= 890
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    };
    // this function is triggered every time the route changes, because navbar transparency needs to be checked per page.
    const checkNavbarProperties = () => {
      if (!hidden) {
        handleTransparency().then((shouldBeTransparent) => {
          let firstSection;
          const sections = document
            .getElementById("__next")
            ?.querySelector?.("main").children;
          for (let i = 0; i < sections.length; i++) {
            // Avoid selecting Hidden H1
            if (!sections[i].getAttribute("data-hidden-h1")) {
              firstSection = sections[i];
              break;
            }
          }
          if (window.innerWidth < 890) setTransparentBackground(false);
          if (
            window.scrollY >
            firstSection.getBoundingClientRect().top +
              document.getElementById("globalSecondaryNav").clientHeight
          ) {
            setPageScrolled(true);
            setTransparentBackground(false);
          } else {
            setPageScrolled(false);
            setTransparentBackground(shouldBeTransparent);
          }
        });
      }
    };
    const checkNavbarPropertiesThrottled = () => {
      if (!throttling) {
        throttling = true;
        setTimeout(() => {
          checkNavbarProperties();
          throttling = false;
        }, 50);
      }
    };
    // run route change handler also on initial page load
    checkNavbarProperties();
    router.events.on("routeChangeComplete", checkNavbarProperties);
    window.addEventListener("resize", checkNavbarPropertiesThrottled);
    window.addEventListener("scroll", checkNavbarPropertiesThrottled);
    return () => {
      router.events.off("routeChangeComplete", checkNavbarProperties);
      window.removeEventListener("resize", checkNavbarPropertiesThrottled);
      window.removeEventListener("scroll", checkNavbarPropertiesThrottled);
    };
  }, []);

  // This is used because hiding body overflow-y does not work on iOS Safari
  // const preventTouchScroll = useCallback((e) => {
  //   e.preventDefault();
  // }, [setMainNavigationActive]);

  // useEffect(() => {
  //   if (mainNavigationActive) {
  //     document.body.style.overflowY = "hidden";
  //     document.body.addEventListener("touchmove", preventTouchScroll, { passive: false });
  //   } else {
  //     document.body.style.overflowY = "";
  //     document.body.removeEventListener("touchmove", preventTouchScroll);
  //   }
  //   return () => document.body.removeEventListener("touchmove", preventTouchScroll);
  // }, [mainNavigationActive, preventTouchScroll]);

  const handleSetMainNavigationActive = () => {
    setMainNavigationActive(!mainNavigationActive);
  };

  return (
    <section
      className={`${style.navbar} ${pageScrolled ? style.scrolled : ""} ${
        transparentBackground ? style.transparent : ""
      } ${hidden ? "display-none" : ""} ${
        mainNavigationActive ? style.mobileNavActive : ""
      }
        `}
      ref={navbarRef}
    >
      {/* Begin Navbar Secondary */}
      {navbar.fields.navbarSecondary?.length > 0 && (
        <NavbarSecondary
          navbarData={navbar}
          styleClsss={style.navbarSecondary}
        ></NavbarSecondary>
      )}

      {/* End Navbar Secondary */}
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
          onClick={() => handleSetMainNavigationActive()}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div
          className={`${style.mainNavigationContainer} ${
            mainNavigationActive
              ? style.mainNavigationContainerActive
              : style.mainNavigationContainerClosed
          }`}
        >
          <MainNavigation
            active={mainNavigationActive}
            mainNavigation={navbar.fields.mainNavigation}
            handleSetMainNavigationActive={handleSetMainNavigationActive}
            navbarData={navbar}
          />
        </div>
      </nav>
    </section>
  );
};

Navbar.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let navbarGroups = null;

  try {
    let navbar = await api.getContentList({
      referenceName: "navbarConfiguration",
      languageCode: languageCode,
      contentLinkDepth: 5,
      expandAllContentLinks: true,
    });

    if (navbar && navbar.items && navbar.items.length > 0) {
      navbarGroups = navbar.items[0];
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
    navbar: navbarGroups,
  };
};

export default Navbar;
