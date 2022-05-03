import style from "./brandFooter.module.scss";
import logo from "../../../assets/ujet-logo.svg";
import Link from "next/link";
const BrandFooter = () => {
  return (
    <footer className={style.footer}>
      <div className="container">
        <Link href="/">
          <a
            title="Navigate  to home page"
            aria-label="Navigate to home page"
            className={style.brand}
          >
            <img
              className={style.logo}
              src={logo.src}
              width={logo.width * 1.2}
              height={logo.height * 1.2}
              alt="Ujet logo"
            />
          </a>
        </Link>
        <div className={style.textContainer}>
          <span> Copyright 2022</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default BrandFooter;
