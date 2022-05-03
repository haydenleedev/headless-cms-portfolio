import logo from "../../../assets/ujet-logo.svg";
import style from "./brandNavbar.module.scss";
import { sleep } from "../../../utils/generic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import GlobalContext from "../../../context";

const BrandNavbar = ({ globalData }) => {

  
  return (
    <section>
        <p>uhhh</p>
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
    let navbar = await api.getContentList({
      referenceName: "brandNavbarConfiguration",
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

export default BrandNavbar;
