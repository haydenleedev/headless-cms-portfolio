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

const Navbar = ({}) => {
  // affects only mobile
  const [mainNavigationActive, setMainNavigationActive] = useState(false);

  return (
    <section className={style.navbar}>
      <nav className="container" role="navigation" aria-label="Main">
        <img
          className={style.logo}
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt="Ujet logo"
        />
        <button
          className={style.navbarToggle}
          onClick={() => {
            setMainNavigationActive(!mainNavigationActive);
          }}
        >
          Menu
        </button>
        <MainNavigation active={mainNavigationActive} navigationMenu={mainNavs} />
      </nav>
    </section>
  );
};

export default Navbar;
