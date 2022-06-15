import style from "./footer.module.scss";
import Link from "next/link";
import Script from "next/script";
import { AgilityImage, renderHTML } from "@agility/nextjs";
import { isMobile } from "../../../utils/responsivity";
import { useState } from "react";
import AgilityLink from "../../agilityLink";

const Footer = ({ globalData }) => {
  const { data, featuredAwards } = globalData.footer;
  const global = globalData.globalSettings.data;
  const [activeFooterColumn, setActiveFooterColumn] = useState(null);
  featuredAwards?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });
  function toggleFooterColumn(item) {
    if (isMobile()) {
      if (item == activeFooterColumn) {
        setActiveFooterColumn(null);
        return;
      }
      setActiveFooterColumn(item);
    }
  }

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
                      ? "150"
                      : data.fields.logo.pixelWidth
                  }
                  height={
                    data.fields.logo.pixelHeight == 0
                      ? "52"
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
                      alt=""
                    ></img>
                  </a>
                ))}
              </div>
            )}
            {featuredAwards?.length > 0 && (
              <div className={style.awards}>
                <p className={style.awardsTitle}>{data.fields.awardsTitle}</p>
                <div className={`${style.badges}`}>
                  {featuredAwards.map(
                    (award, index) =>
                      index < 3 && (
                        // <a
                        //   href={award.fields.link.href}
                        //   aria-label={award.fields.link.text}
                        //   title={award.fields.link.text}
                        //   key={award.contentID}
                        //   target="_blank"
                        //   rel="noindex noreferrer noopener"
                        // >
                        <AgilityImage
                          src={award.fields.image.url}
                          layout="responsive"
                          width="4"
                          height="5"
                          objectFit="contain"
                          alt=""
                          key={award.contentID}
                        ></AgilityImage>
                        // </a>
                      )
                  )}
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
            {data.fields.mainNavigation?.length > 0 &&
              data.fields.mainNavigation.map((item) => (
                // Footer column
                <div
                  className={`column ${style.footerColumn}`}
                  key={item.contentID}
                >
                  <button
                    className={`${style.footerColumnTitle}`}
                    onClick={() => {
                      toggleFooterColumn(item.contentID);
                    }}
                    aria-controls={item.contentID}
                    aria-expanded={
                      (!isMobile() && true) ||
                      activeFooterColumn == item.contentID
                        ? true
                        : false
                    }
                  >
                    <span>{item.fields.heading}</span>
                    <span className={style.toggleIcon}>
                      {activeFooterColumn == item.contentID ? "-" : "+"}
                    </span>
                  </button>
                  <ul
                    id={item.contentID}
                    className={`${
                      activeFooterColumn == item.contentID
                        ? style.footerColumnActive
                        : style.footerColumnClosed
                    }`}
                  >
                    {item.fields.links?.length > 0 &&
                      item.fields.links.map((link, index) => (
                        <li key={"footer-main-" + index}>
                          <AgilityLink
                            agilityLink={link.fields.link}
                            title={"Navigate to " + link.fields.link.text}
                            ariaLabel={"Navigate to " + link.fields.link.text}
                            className={style.footerColumnLink}
                          >
                            {link.fields.link.text}
                          </AgilityLink>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </nav>
        </div>
        <hr className={style.horizontalLine}></hr>
        <div className={style.footNote}>
          <div className={style.cookies}>
            {/* <Script
              src="//consent.truste.com/notice?domain=ujet.co&c=teconsent&js=bb&noticeType=bb&gtm=1"
              async={true}
              strategy="lazyOnload"
            /> */}
            {/* "In order to generate the required GTM events you must add the
            following code to every page on which the CM is deployed" */}
            <Script
              id="gtmEventsScript"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={renderHTML(
                `var __dispatched__ = {}; var __i__ = self.postMessage && setInterval(function() { if (self.PrivacyManagerAPI && __i__) { var apiObject = { PrivacyManagerAPI: { action: "getConsentDecision", timestamp: new Date().getTime(), self: self.location.host } }; self.top.postMessage(JSON.stringify(apiObject), "*"); __i__ = clearInterval(__i__); } }, 50); self.addEventListener("message", function(e, d) { try { if (e.data && (d = JSON.parse(e.data)) && (d = d.PrivacyManagerAPI) && d.capabilities && d.action == "getConsentDecision") { var newDecision = self.PrivacyManagerAPI.callApi("getGDPRConsentDecision", self.location.host).consentDecision; newDecision && newDecision.forEach(function(label) { if (!__dispatched__[label]) { self.dataLayer && self.dataLayer.push({ "event": "GDPR Pref Allows "+label}); __dispatched__[label] = 1; } }); } } catch (xx){ } });`
              )}
            />
            {/* <div id="ot-sdk-cookie-policy"></div> */}
            {/* <button id="ot-sdk-btn" className="ot-sdk-show-settings">
              Cookie Settings
            </button> */}

            {/* <div id="teconsent"></div>
            <div className={style.trusteLinks}>
              <a
                href="//privacy.truste.com/privacy-seal/validation?rid=c2d82a58-c9ed-4d48-b827-653acbf4d418"
                target="_ blank"
                rel="noreferrer"
              >
                <img
                  width="106"
                  height={"34"}
                  src="//privacy-policy.truste.com/privacy-seal/seal?rid=c2d82a58-c9ed-4d48-b827-653acbf4d418"
                  alt="TRUSTe"
                />
              </a>
              <a
                href="https://submit-irm.trustarc.com/services/validation/bac0a2d7-003d-4c6d-8171-d3fd1756d56d"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  width="106"
                  height="32"
                  src="https://submit-irm.trustarc.com/services/validation/bac0a2d7-003d-4c6d-8171-d3fd1756d56d/image"
                  alt="TrustArc"
                />
              </a>
            </div> */}
            {/* <!-- OneTrust Cookies Settings button start --> */}
            <button id="ot-sdk-btn" className={`ot-sdk-show-settings`}>
              Cookie Settings
            </button>
            {/* <!-- OneTrust Cookies Settings button end --> */}
            {/* <!-- OneTrust Cookies List start --> */}
            {/* <div id="ot-sdk-cookie-policy"></div> */}
            {/* <!-- OneTrust Cookies List end --> */}
          </div>
          <div className={`${style.footNoteLinks}`}>
            <p className={style.footNoteLink}>{data.fields.copyrightText}</p>
            {data.fields.bottomNavigation?.length > 0 &&
              data.fields.bottomNavigation.map((item) => (
                <AgilityLink
                  agilityLink={item.fields.link}
                  key={item.contentID}
                  className={style.footNoteLink}
                >
                  {item.fields.link.text}
                </AgilityLink>
              ))}
          </div>
        </div>
      </div>
      <div id="consent_blackbar" className={style.consentBlackbar}></div>
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

  let featuredAwards = await api.getContentList({
    referenceName: "featuredawards",
    languageCode,
    sort: "properties.itemOrder",
    direction: "desc",
    expandAllContentLinks: true,
    take: 7,
  });
  featuredAwards = featuredAwards.items[0].fields.awards;

  try {
    let data = await api.getContentList({
      referenceName: "footerConfiguration",
      languageCode: languageCode,
      take: 1,
      contentLinkDepth: 4,
    });

    if (data && data.items && data.items?.length > 0) {
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
    featuredAwards,
  };
};

export default Footer;
