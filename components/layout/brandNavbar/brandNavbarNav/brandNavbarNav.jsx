import Link from "next/link";
import logo from "../../../../assets/ujet-logo.svg";
import { useState } from "react";
import style from "./brandNavbarNav.module.scss";
const BrandNavbarNav = ({ globalData }) => {
  const { brandNavbar } = globalData.brandNavbar;
  const copyrightText = globalData.footer.data.fields.copyrightText;
  //Affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);
  const [disableAnimation, setDisableAnimation] = useState(true);
  const closeMenu = () => {
    setMainNavigationActive(false);
  };
  const handleSetMainNavigationActive = () => {
    setMainNavigationActive(!mainNavigationActive);
    setDisableAnimation(false);
  };
  return (
    <nav className={style.nav} role="navigation" aria-label="Main">
      <button
        aria-label="Toggle main navigation menu"
        title="Toggle main navigation menu"
        onClick={() => handleSetMainNavigationActive()}
        className={`${style.navbarToggle}`}
      >
        <p
          className={`${style.closeMenu} ${
            !mainNavigationActive && style.hide
          }`}
        >
          X
        </p>
        <span className={mainNavigationActive && style.hide}></span>
        <span className={mainNavigationActive && style.hide}></span>
      </button>
      <div className={style.logoContainer}>
        <Link
          href="/brand"
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
        </Link>
      </div>
      <div
        className={`${style.mainNavigationContainer} ${
          mainNavigationActive
            ? style.mainNavigationContainerActive
            : style.mainNavigationContainerHidden
        } ${disableAnimation ? style.disableAnimation : ""}`}
      >
        <ul className={style.mainNavigation}>
          {brandNavbar.fields.mainNavigation.length > 0 &&
            brandNavbar.fields.mainNavigation.map((item, index) => {
              return (
                <li key={`navitem${index}`}>
                  <Link
                    href={item.fields.mainLink.fields.link.href}
                    className={style.navLink}
                    onClick={() => closeMenu()}
                    title={`Navigate to ${item.fields.mainLink.fields.link.text} page`}
                    aria-label={`Navigate to ${item.fields.mainLink.fields.link.text} page`}
                  >
                    {item.fields.mainLink.fields.link.text}
                  </Link>
                </li>
              );
            })}
          <p className={style.copyright}>{copyrightText}</p>
        </ul>
      </div>
      <div className={style.buttonContainer}>
        <Link href="/contact-sales">Questions?</Link>
      </div>
    </nav>
  );
};
export default BrandNavbarNav;
