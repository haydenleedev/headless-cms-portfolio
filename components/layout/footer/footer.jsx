import style from "./footer.module.scss";
import logo from "../../../assets/ujet-logo.svg";
import Link from "next/link";

const Footer = ({}) => {
  return (
    <footer className={style.footer}>
      {/* Footer has a special case for container, it's a bit wider than the standard one */}
      <div className={style.container}>
        <div className="row-desktop">
          <div className={` ${style.brand}`}>
            <Link href="/">
              <a title="Go to home page" aria-label="Go to home page">
                <img
                  className={style.logo}
                  src={logo.src}
                  width={logo.width}
                  height={logo.height}
                  alt="Ujet logo"
                />
              </a>
            </Link>
            <a
              href="tel:TODO insert-number-from-cms-here"
              aria-label="UJET phone number"
              className={style.contactLink}
            >
              1-123-123-123
            </a>
            <a
              href="#"
              aria-label="Request a demo from UJET"
              className={style.contactLink}
            >
              Request a demo
            </a>
            <a
              href="#"
              aria-label="TODO: insert from CMS"
              className={style.contactLink}
            >
              UJET Support
            </a>
            <div className={style.socialMedia}>
              <span>
                <a href="#" aria-label="Go to X social media">
                  Icon
                </a>
              </span>
              <span>
                <a href="#" aria-label="Go to X social media">
                  Icon
                </a>
              </span>
              <span>
                <a href="#" aria-label="Go to X social media">
                  Icon
                </a>
              </span>
              <span>
                <a href="#" aria-label="Go to X social media">
                  Icon
                </a>
              </span>
            </div>
            <div className={style.awards}>
              <p className={style.awardsTitle}>Awards and recognition</p>
              <div className={style.badges}>
                <img alt="add"></img>
                <img alt="awards"></img>
                <img alt="here"></img>
              </div>
            </div>
          </div>
          <div className="columns repeat-4">
            <div className={`column ${style.footerColumn}`}>
              <p className={style.footerColumnTitle}>Title</p>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
            </div>
            <div className={`column ${style.footerColumn}`}>
              <p className={style.footerColumnTitle}>Title</p>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
            </div>
            <div className={`column ${style.footerColumn}`}>
              <p className={style.footerColumnTitle}>Title</p>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
            </div>
            <div className={`column ${style.footerColumn}`}>
              <p className={style.footerColumnTitle}>Title</p>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
            </div>
            <div className={`column ${style.footerColumn}`}>
              <p className={style.footerColumnTitle}>Title</p>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
            </div>
            <div className={`column ${style.footerColumn}`}>
              <p className={style.footerColumnTitle}>Title</p>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
              <Link href="#">
                <a className={style.footerColumnLink}>Link</a>
              </Link>
            </div>
          </div>
        </div>
        <hr className={style.horizontalLine}></hr>
        <div className={` repeat-5 ${style.footNote}`}>
          <div className={` ${style.cookies}`}>
            <img alt="Cookie modal here"></img>
            <img alt="Trust Arc here"></img>
          </div>
          <div className={`${style.footNoteLinks}`}>
            <Link href="#">
              <a className={style.footNoteLink}>Render links here</a>
            </Link>{" "}
            <Link href="#">
              <a className={style.footNoteLink}>Render links here</a>
            </Link>{" "}
            <Link href="#">
              <a className={style.footNoteLink}>Render links here</a>
            </Link>{" "}
            <Link href="#">
              <a className={style.footNoteLink}>Render links here</a>
            </Link>{" "}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
