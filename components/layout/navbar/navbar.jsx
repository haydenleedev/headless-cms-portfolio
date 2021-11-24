import logo from "../../../assets/ujet-logo.svg";
import style from "./navbar.module.scss";
import MainNavigation from "./mainNavigation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Navbar = ({ globalData }) => {
  const { navbar } = globalData.navbar;
  const router = useRouter();
  // affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);
  const [pageScrolled, setPageScrolled] = useState(false);
  const [transparentBackground, setTransparentBackground] = useState(false);

  useEffect(() => {
    const handleTransparency = () => {
      return new Promise((resolve) => {
        // check if TransparentizeNavbar module is placed on top of the Agility page module list.
        // promise is resolved to true if the module is detected. Otherwise resolves to false
        const firstSection = document
          .getElementById("__next")
          .querySelector("main").firstChild;
        if (
          // transparency is dismissed with touch screen sizes.
          firstSection.getAttribute("data-transparent-navbar") &&
          window.innerWidth >= 890
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    };
    // this function is triggered every time the route changes, because navbar transparency needs to be checked per page.
    const handleRouteChange = () => {
      handleTransparency().then((shouldBeTransparent) => {
        const options = {
          rootMargin: "0px 0px 0px 0px",
          threshold: 1,
        };
        const firstSection = document
          .getElementById("__next")
          .querySelector("main").firstChild;
        const observer = new IntersectionObserver(([entry]) => {
          // transparency is dismissed with touch screen sizes.
          if (window.innerWidth < 890) setTransparentBackground(false);
          if (entry.isIntersecting) {
            setPageScrolled(false);
            if (shouldBeTransparent) setTransparentBackground(true);
          } else {
            setPageScrolled(true);
            setTransparentBackground(false);
          }
        }, options);
        // observe intersections with the first page section.
        observer.observe(firstSection);
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

  return (
    <section
      className={`${style.navbar} ${pageScrolled ? style.scrolled : ""} ${
        transparentBackground ? style.transparent : ""
      }`}
    >
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
    </section>
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
