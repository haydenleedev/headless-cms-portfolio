import style from "./brandFooter.module.scss";
import logo from "../../../assets/ujet-logo.svg";
import Link from "next/link";
import { AgilityImage } from "@agility/nextjs";
const BrandFooter = ({ globalData }) => {
  const copyrightText = globalData.footer.data.fields.copyrightText;
  //split copyright text into two parts
  const index = copyrightText.lastIndexOf(2) + 1;
  const copyrightPart1 = copyrightText.substring(0, index);
  const copyrightPart2 = copyrightText.substring(index);
  return (
    <footer className={`max-width-brand ${style.footer}`}>
      <div>
        <Link href="/brand">
          <a
            title="Navigate to home page"
            aria-label="Navigate to home page"
            className={style.brand}
          >
            <AgilityImage
              src={logo.src}
              data-src={logo.src}
              width={logo.width * 1.2}
              height={logo.height * 1.2}
              alt="UJET logo"
            />
          </a>
        </Link>
        <div className={style.textContainer}>
          <span> {copyrightPart1}</span>
          <span> {copyrightPart2}</span>
        </div>
      </div>
    </footer>
  );
};

export default BrandFooter;
