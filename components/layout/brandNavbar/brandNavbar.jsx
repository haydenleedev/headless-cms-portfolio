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
  console.log(brandNavbar)
  const router = useRouter();
  //Affects only mobile
    const [mainNavigationActive, setMainNavigationActive] = useState(false);
    const [pageScrolled, setPageScrolled] = useState(false);
    const [transparentBackground, setTransparentBackground] = useState(false);
    const [hidden, setHidden] = useState(false);


    const handleSetMainNavigationActive = () => {
      setMainNavigationActive(!mainNavigationActive);
    };
  return (
    <section className={`${style.navbar} `}>
       <nav className={style.nav} role="navigation" aria-label="Main">
         <div className={style.logoContainer}>
        <Link href="/">
          <a
            title="Navigate  to home page"
            aria-label="Navigate to home page"
            className={style.brand}
          >
            <img
              className={style.logo}
              src={logo.src}
              width={logo.width * 1.37}
              height={logo.height * 1.37}
              alt="Ujet logo"
            />
          </a>
        </Link>
        </div>
        <button
          aria-label="Toggle main navigation menu"
          title="Toggle main navigation menu"
          className={`${style.navbarToggle
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div
          className={`${style.mainNavigationContainer } ${
            mainNavigationActive
              ? style.mainNavigationContainerActive
              : style.mainNavigationContainerClosed
          }`}
        >
            {brandNavbar.fields.mainNavigation.length >0 && brandNavbar.fields.mainNavigation.map((item, index) =>{
              return <Link key={`navitem${index}`} href={item.fields.mainLink.fields.link.href} className={style.navLink}>
                
               {item.fields.mainLink.fields.link.text}
              </Link>
            })}
        </div>
        <div className={style.buttonContainer}>
            <Link href="/">
              Questions?
            </Link>
        </div>
      </nav>
    </section>
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
