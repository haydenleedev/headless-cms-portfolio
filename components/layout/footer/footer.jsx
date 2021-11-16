import style from "./footer.module.scss";
import logo from "../../../assets/ujet-logo.svg";
import Link from "next/link";
import { AgilityImage } from "@agility/nextjs";

const Footer = ({ globalData }) => {
  const { data } = globalData.footer;
  const global = globalData.globalSettings.data;
  console.log(data);
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
                  src={data.fields.logo.url}
                  width={
                    data.fields.logo.pixelWidth == 0
                      ? "96"
                      : data.fields.logo.pixelWidth
                  }
                  height={
                    data.fields.logo.pixelHeight == 0
                      ? "auto"
                      : data.fields.logo.pixelHeight
                  }
                  alt=""
                />
              </a>
            </Link>
            {global.fields.primaryPhone && (
              <a
                href={"tel:" + global.fields.primaryPhone}
                aria-label={"Call " + global.fields.primaryPhone}
                className={style.contactLink}
              >
                {global.fields.primaryPhone}
              </a>
            )}
            {data.fields.contactLinks?.length > 0 &&
              data.fields.contactLinks.map((contactLink) => (
                <a
                  href={contactLink.fields.link.href}
                  aria-label={contactLink.fields.link.text}
                  className={style.contactLink}
                  key={contactLink.contentID}
                >
                  {contactLink.fields.link.text}
                </a>
              ))}
            {data.fields.socialMedia?.length > 0 && (
              <div className={style.socialMedia}>
                {data.fields.socialMedia.map((item) => (
                  <a
                    href={item.fields.link.href}
                    aria-label={item.fields.link.text}
                    title={item.fields.link.text}
                    key={item.contentID}
                  >
                    <img
                      src={item.fields.image.url}
                      width="32"
                      height="32"
                    ></img>
                  </a>
                ))}
              </div>
            )}
            {data.fields.awards?.length > 0 && (
              <div className={style.awards}>
                <p className={style.awardsTitle}>{data.fields.awardsTitle}</p>
                <div className={`${style.badges}`}>
                  {data.fields.awards.map((award) => (
                    <a
                      href={award.fields.link.href}
                      aria-label={award.fields.link.text}
                      title={award.fields.link.text}
                      key={award.contentID}
                    >
                      <AgilityImage
                        src={award.fields.image.url}
                        layout="responsive"
                        width="4"
                        height="5"
                        objectFit="contain"
                      ></AgilityImage>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav
            role="navigation"
            aria-label="Footer main navigation"
            className={`reset columns repeat-4 ${style.mainNavigation}`}
          >
            {data.fields.mainNavigation.length > 0 &&
              data.fields.mainNavigation.map((item) => (
                <div className={`column ${style.footerColumn}`}>
                  <p className={style.footerColumnTitle}>
                    {item.fields.heading}
                  </p>
                  <ul>
                    {item.fields.links.length > 0 &&
                      item.fields.links.map((link, index) => (
                        <li key={"footer-main-" + index}>
                          <Link
                            title={"Navigate to " + link.fields.link.text}
                            aria-label={"Navigate to " + link.fields.link.text}
                            href={link.fields.link.href}
                            target={link.fields.link.target}
                          >
                            <a className={style.footerColumnLink}>
                              {link.fields.link.text}
                            </a>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </nav>
        </div>
        <hr className={style.horizontalLine}></hr>
        <div className={` repeat-5 ${style.footNote}`}>
          <div className={` ${style.cookies}`}>
            <img alt="Cookie modal here"></img>
            <img alt="Trust Arc here"></img>
          </div>
          <div className={`${style.footNoteLinks}`}>
            <p className={style.footNoteLink}>{data.fields.copyrightText}</p>
            {data.fields.bottomNavigation.length > 0 &&
              data.fields.bottomNavigation.map((item) => (
                <Link href={item.fields.link.href}>
                  <a
                    className={style.footNoteLink}
                    target={item.fields.link.target}
                  >
                    {item.fields.link.text}
                  </a>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let contentItem = null;

  try {
    let data = await api.getContentList({
      referenceName: "footerConfiguration",
      languageCode: languageCode,
      take: 1,
      contentLinkDepth: 4,
    });

    if (data && data.items && data.items.length > 0) {
      contentItem = data.items[0];
    } else {
      return null;
    }
  } catch (error) {
    if (console)
      console.error("Could not load site footer configuration.", error);
    return null;
  }
  // return a clean object...
  return {
    data: contentItem,
  };
};

export default Footer;
