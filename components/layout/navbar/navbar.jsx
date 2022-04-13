import logo from "../../../assets/ujet-logo.svg";
import style from "./navbar.module.scss";
import MainNavigation from "./mainNavigation";
import NavbarSecondary from "../navbarSecondary/navbarSecondary";
import { sleep } from "../../../utils/generic";
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

  useEffect(() => {
    const handleTransparency = () => {
      return new Promise((resolve) => {
        // check if TransparentizeNavbar module is placed on top of the Agility page module list.
        // promise is resolved to true if the module is detected. Otherwise resolves to false
        const firstSection = document
          .getElementById("__next")
          ?.querySelector?.("main").firstChild;
        if (firstSection?.getAttribute("data-navbar-hidden")) {
          setHidden(true);
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
    // run after slight delay to prevent weird issues with the intersection api not correctly registering the observable on the new page.
    const handleRouteChange = () => {
      sleep(50).then(() => {
        handleTransparency().then((shouldBeTransparent) => {
          const options = {
            threshold: 1.0,
            rootMargin: "-80px 0px 0px 0px",
          };
          const firstSection = document
            .getElementById("__next")
            .querySelector("main").firstChild;
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              // transparency is dismissed with touch screen sizes.
              if (window.innerWidth < 890) setTransparentBackground(false);
              if (entry.intersectionRatio === 1) {
                setPageScrolled(false);
                if (shouldBeTransparent) setTransparentBackground(true);
              } else {
                setPageScrolled(true);
                setTransparentBackground(false);
              }
            });
          }, options);
          // observe intersections with the first page section.
          if (firstSection) observer.observe(firstSection);
        });
      });
    };
    // run route change handler also on initial page load
    handleRouteChange();
    router.events.on("routeChangeComplete", handleRouteChange);
    window.addEventListener("resize", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      window.removeEventListener("resize", handleRouteChange);
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
