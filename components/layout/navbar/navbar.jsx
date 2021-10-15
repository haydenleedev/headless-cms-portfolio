import logo from "../../../assets/ujet-logo.svg";
import style from "./navbar.module.scss";
import MainNavigation from "./mainNavigation";
import Link from "next/link";
import { useState } from "react";

const mainNavs = [
  {
    // Navigation group
    main_menu: "Why UJET",
    href: "why-ujet",
    columns: [
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
      ],
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
      ],
    ],
  },
  {
    // Navigation group
    main_menu: "nav",
    href: "why-ujet",
    columns: [
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
        },
      ],
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
      ],
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
      ],
    ],
  },
  {
    // Navigation group
    main_menu: "Why UJET",
    href: "why-ujet",
    columns: [
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
      ],
      [
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
        {
          sub_item: "Why UJET",
          sub_href: "/why-ujet/",
          navigationItemChildren: [
            {
              dropdown_menu: "Embeddable Experience",
              dropdown_href: "/embeddable-experience/",
            },
          ],
        },
      ],
    ],
  },
];

const Navbar = ({ globalData }) => {
  const { navbar } = globalData.navbar;
  // affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);

  return (
    <section className={style.navbar}>
      <nav className="container" role="navigation" aria-label="Main">
        <Link href="/">
          <a title="Go to home page" aria-label="Go to home page">
            <img className={style.logo} src={logo.src} width={logo.width} height={logo.height} alt="Ujet logo" />
          </a>
        </Link>
        <button
          className={style.navbarToggle}
          onClick={() => {
            setMainNavigationActive(!mainNavigationActive);
          }}
        >
          Menu
        </button>
        <MainNavigation active={mainNavigationActive} mainNavigation={navbar.fields.mainNavigation} />
      </nav>
    </section>
  );
};

Navbar.getCustomInitialProps = async function ({ agility, languageCode, channelName }) {
  const api = agility;
  let contentItem = null;

  try {
    let navbar = await api.getContentList({
      referenceName: "navbarConfiguration",
      languageCode: languageCode,
      take: 1,
      contentLinkDepth: 4
    });
    if (navbar && navbar.items && navbar.items.length > 0) {
      contentItem = navbar.items[0];
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load site navbar configuration.", error);
    return null;
  }
  // return clean object...
  return {
    navbar: contentItem,
  };
};

export default Navbar;
