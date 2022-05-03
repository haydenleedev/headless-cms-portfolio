import style from "./brandFooter.module.scss";
import Link from "next/link";
import Script from "next/script";
import { AgilityImage, renderHTML } from "@agility/nextjs";
import { isMobile } from "../../../utils/responsivity";
import { useState } from "react";
import AgilityLink from "../../agilityLink";

const BrandFooter = () => {
  return (
    <footer className={style.footer}>
        <div className={style.container}>
    <div className={style.textContainer}>
        <span> Copyright 2022</span>
        <span>All Rights Reserved</span>
       
    </div>
    </div>
    </footer>
  );
};

export default BrandFooter;
