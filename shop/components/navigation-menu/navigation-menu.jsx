import Head from "next/head";
import { Component, Fragment } from "react";
import Link from "next/link";
import MenuList from "./navigation-menu-list";
import nav from "./nav.module.scss";

const mainNavs = [
  {
    id: "m1",
    main_menu: "Why UJET",
    href: "/why-ujet/",
    dropdowns: [
      {
        sub_menu: [
          {
            sub_item: "Why UJET",
            sub_href: "/why-ujet/",
          },
          {
            sub_item: "Customer Stories",
            sub_href: "/customerstories/",
          },
          {
            sub_item: "Security & Privacy",
            sub_href: "/security/",
          },
          {
            sub_item: "Intelligence & Automation",
            sub_href: "/intelligence-automation/",
          },
          {
            sub_item: "Embeddable Experience",
            sub_href: "/embeddable-experience/",
          },
          {
            sub_item: "Purpose-Built for the CRM",
            sub_href: "/purpose-built-for-the-crm/",
          },
        ],
      },
    ],
  },
  {
    id: "m2",
    main_menu: "Platform",
    href: "/overview/",
    dropdowns: [
      {
        sub_menu: [
          {
            sub_item: "Product Overview",
            sub_href: "/overview/",
          },
          {
            sub_item: "Channels",
            sub_href: "/channels/",
          },
          {
            sub_item: "Agent Assist",
            sub_href: "/agent-assist/",
          },

          {
            sub_item: "Remote Agents",
            sub_href: "/remote-work-from-home-solution/",
          },

          {
            sub_item: "Virtual Agent",
            sub_href: "/virtual-agent/",
          },
          {
            sub_item: "Outbound Dialer",
            sub_href: "/outbound-dialer/",
          },

          {
            sub_item: "Advanced Reporting & Analytics",
            sub_href: "/ujet-advanced-reporting/",
          },
        ],
      },
    ],
  },
  {
    id: "m3",
    main_menu: "Solutions",
    href: "#",
    dropdowns: [
      {
        sub_menu: [
          {
            sub_item: "Small & Medium Businessess",
            sub_href: "/ujet-for-smb/",
          },
          {
            sub_item: "Financial Services",
            sub_href: "/ujet-for-financial-services/",
          },
          {
            sub_item: "Healthcare",
            sub_href: "/ujet-for-healthcare/",
          },
          {
            sub_item: "On-Demand Services",
            sub_href: "/ujet-for-financial-services/",
          },
          {
            sub_item: "Retail",
            sub_href: "/ujet-for-retail/",
          },
          {
            sub_item: "Partnerships & Integrations",
            sub_href: "/contact-center-software-integrations/",
          },
        ],
      },
    ],
  },
  {
    id: "m4",
    main_menu: "Resources",
    href: "why-ujet",
    dropdowns: [
      {
        sub_menu: [
          {
            sub_item: "Newsroom",
            sub_href: "/press/",
          },
          {
            sub_item: "Guides & Reports",
            sub_href: "/resources/#guides-and-reports",
          },
          {
            sub_item: "e-Books & White Papers",
            sub_href: "/resources/#whitepapers-and-ebooks",
          },
          {
            sub_item: "Partner Content",
            sub_href: "/resources/#partner-content",
          },
          {
            sub_item: "Product Data Sheets",
            sub_href: "/resources/#integration-guides",
          },
          {
            sub_item: "Videos & Webinars",
            sub_href: "/resources/#webinars",
          },
          {
            sub_item: "Blog",
            sub_href: "/blog/",
          },
        ],
      },
    ],
  },
  {
    id: "m5",
    main_menu: "Pricing",
    href: "/pricing/ujet-packages/",
  },
  {
    id: "m6",
    main_menu: "Contact Us",
    href: "/contact-sales/",
  },
];

class NavigationMenu extends Component {
  render() {
    const headMenue = this.props.headMenu;
    const menue = this.props.menu;

    return (
      <Fragment>
        <input
          type="checkbox"
          id="menustate"
          className={nav.menustate}
          tabIndex="-1"
          aria-hidden="true"
        ></input>
        <header className={nav.stick} id={nav.stick}>
          <nav className={`${nav["primary-nav"]} ${nav["sticky-wrap"]}`}>
            <ul className={nav["mobile-menu"]}>
              <li className={nav.menuicon}>
                <label
                  className={nav["menuicon-label"]}
                  htmlFor="menustate"
                  aria-hidden="true"
                >
                  <span>Mobile Menu</span>
                </label>
              </li>
            </ul>
            <ul className={nav.menu}>
              <li className={nav.logo}>
                <Link href="https://ujet.cx" passHref>
                  <a>
                    UJET.cx, the world’s first and only CCaaS 3.0 cloud contact
                    center provider.
                  </a>
                </Link>
              </li>
            </ul>
            <MenuList primary_menus={mainNavs} />
          </nav>
        </header>
      </Fragment>
    );
  }
}

export default NavigationMenu;
