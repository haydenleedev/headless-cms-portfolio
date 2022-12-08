import Heading from "../heading";
import style from "./firstFold.module.scss";
import Media from "../media";
import { boolean } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import { renderHTML } from "@agility/nextjs";
import {
  sanitizeHtmlConfig,
  textSizeSanitizeConfig,
  vimeoLinkToEmbed,
  youTubeVideoLinkToEmbed,
} from "../../../utils/convert";
import CustomSVG from "../../customSVG/customSVG";
import { useIntersectionObserver } from "../../../utils/hooks";
import { useEffect } from "react";
import { youTubeActivityEvent } from "../../../utils/dataLayer";
import Script from "next/script";

const FirstFold = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const uncenteredVertically = boolean(fields.uncenteredVertically);
  const noImageLayout =
    !fields.media && !fields.customSVG && !fields.videoURL?.href;
  const narrowContainer = boolean(fields?.narrowContainer);
  const animateSVG = fields?.animate || "static";
  const fixedMediaHeight = fields?.fixedMediaHeight;
  const linksStyle = fields?.linksStyle || "button";
  const layout = fields.layout;
  const hideHeading = boolean(fields?.hideHeading);
  let videoSrc;
  let isYouTubeVideo = false;
  if (fields?.videoURL?.href?.includes?.("youtube.com")) {
    videoSrc = youTubeVideoLinkToEmbed(fields.videoURL.href);
    isYouTubeVideo = true;
  } else if (fields?.videoURL?.href?.includes?.("vimeo.com")) {
    videoSrc = vimeoLinkToEmbed(fields.videoURL.href);
  }

  useEffect(() => {
    // Add player listeners if the YouTube API script was already loaded
    if (fields?.videoURL?.href && window.YT?.Player) {
      handleAPIScriptLoad(true);
    }
  }, []);

  const handleAPIScriptLoad = (manuallyCallAPIReady) => {
    let player;
    if (manuallyCallAPIReady == true) {
      onYouTubeIframeAPIReadyFirstFold();
    }
    function onYouTubeIframeAPIReadyFirstFold() {
      const playbackPercentages = [
        {
          percentage: 10,
          played: false,
        },
        {
          percentage: 25,
          played: false,
        },
        {
          percentage: 50,
          played: false,
        },
        {
          percentage: 75,
          played: false,
        },
        {
          percentage: 90,
          played: false,
        },
      ];
      let playerStateSequence = [];
      let timer = null;
      let previousVideoTime = null;
      player = new window.YT.Player("video-player");
      player.addEventListener("onStateChange", (e) => {
        const playerState = e.data;
        playerStateSequence = [...playerStateSequence, playerState];
        if (
          arraysAreEqual(playerStateSequence, [2, 3, 1]) ||
          arraysAreEqual(playerStateSequence, [3, 1])
        ) {
          youTubeActivityEvent({ action: "Seek" });
          playerStateSequence = [];
        } else if (
          arraysAreEqual(playerStateSequence, [-1, 3, 1]) ||
          arraysAreEqual(playerStateSequence, [1, 3, 1])
        ) {
          youTubeActivityEvent({ action: "Video start" });
          playerStateSequence = [];
        } else {
          clearTimeout(timer);
          if (playerState !== 3) {
            let timeout = setTimeout(() => {
              if (playerState == 0) {
                youTubeActivityEvent({ action: "Video end" });
              } else if (playerState == 1) {
                youTubeActivityEvent({ action: "Play" });
              } else if (playerState == 2) {
                youTubeActivityEvent({ action: "Pause" });
              }
              playerStateSequence = [];
            }, 250);
            timer = timeout;
          }
        }
      });
      player.addEventListener("onReady", () => {
        setInterval(() => {
          const timeChangeSeconds = Math.round(
            player.getCurrentTime() - previousVideoTime
          );
          let playbackPercentage =
            (player.getCurrentTime() / player.getDuration()) * 100;
          if (timeChangeSeconds > 0 && timeChangeSeconds <= 1) {
            for (let i = 0; i < playbackPercentages.length; i++) {
              if (
                playbackPercentage >= playbackPercentages[i].percentage &&
                !playbackPercentages[i].played
              ) {
                if (
                  Math.round(
                    (playbackPercentages[i].percentage / 100) *
                      player.getDuration() -
                      previousVideoTime
                  ) == 0
                ) {
                  youTubeActivityEvent({
                    action: `Playback percentage: ${playbackPercentages[i].percentage}`,
                  });
                  playbackPercentages[i].played = true;
                }
              }
            }
          }
          previousVideoTime = player.getCurrentTime();
        }, 1000);
      });
      const arraysAreEqual = (firstArr, secondArr) => {
        return firstArr.toString() == secondArr.toString();
      };
    }
    window.onYouTubeIframeAPIReadyFirstFold = onYouTubeIframeAPIReadyFirstFold;
  };

  fields.logos?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // observer for triggering animations if an animation style is selected in agility.
  const intersectionRef = useIntersectionObserver(
    {
      threshold: 0.0,
    },
    0.0,
    fields.animationStyle
      ? () => {
          intersectionRef.current
            .querySelectorAll('*[data-animate="true"]')
            .forEach((elem) => {
              elem.classList.add(fields.animationStyle);
            });
        }
      : null
  );

  // helper function to determine which testimonial module class should be used.
  const testimonialStyle = (value) => {
    if (value !== "quote") return style.testimonialComment;
    return "";
  };

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  const getLinksStyle = () => {
    switch (linksStyle) {
      case "textWithArrow":
        return "chevron-after w-600 mt-2";
      case "buttonNavy":
        return "button navy mt-2";
      case "buttonOrange":
        return "button orange mt-2";
      default:
        return "button cyan outlined mt-2";
    }
  };

  const FirstFoldLink = ({ primary }) => {
    const link = primary ? fields.primaryLink : fields.secondaryLink;
    return link?.href && link?.text ? (
      <div className={style.linkWrapper}>
        <AgilityLink
          agilityLink={link}
          className={`${getLinksStyle()} ${
            primary ? `${style.primaryLink}` : style.secondaryLink
          } ${fields.linkClasses ? fields.linkClasses : ""} ${
            style[linksStyle]
          }`}
          ariaLabel={`Navigate to page ` + link.href}
          title={`Navigate to page ` + link.href}
        >
          {link.text}
        </AgilityLink>
      </div>
    ) : null;
  };

  //Transparentise navbar functionality
  const transparentiseNavbar = boolean(fields.transparentiseNavbar);
  useEffect(() => {
    if (
      transparentiseNavbar &&
      intersectionRef.current &&
      !intersectionRef.current.previousSibling
    ) {
      const nextSiblingModule = intersectionRef.current.nextSibling;
      nextSiblingModule.classList.add("mt--navbar-height");
    }
  }, [intersectionRef]);
  // different layout when alternateLayout or customerStory is toggled on

  if (layout == "alternateLayout" || layout == "customerStory") {
    return (
      <section
        className={`section ${style.firstFoldAlternate}
          ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
          layout == "customerStory" ? "mb-6" : ""
        } ${fields.classes ? fields.classes : ""} ${
          fields?.backgroundColor ? fields?.backgroundColor : ""
        } ${transparentiseNavbar ? "transparentized-navbar-transform" : ""}`}
        id={fields.id ? fields.id : null}
        ref={intersectionRef}
        data-transparent-navbar={transparentiseNavbar}
      >
        {fields.media && (
          <div
            className={`${style.backgroundImage} ${
              fields.mediaClasses ? fields.mediaClasses : ""
            }`}
          >
            <Media media={fields.media} />
          </div>
        )}
        <div
          className={`container ${
            layout == "customerStory"
              ? style.customerStoryTextContent
              : style.textContent
          } ${narrowContainer ? "max-width-narrow" : ""}`}
        >
          <div className={hideHeading ? style.hide : style.heading}>
            <Heading {...heading}></Heading>
          </div>
          {sanitizedHtml && (
            <div
              className={`content ${style.text}`}
              dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
            ></div>
          )}
          <FirstFoldLink primary />
          <FirstFoldLink />
        </div>
      </section>
    );
  } else if (layout == "softwareIntegration") {
    return (
      <section
        className={`section ${mtValue} ${mbValue} ${ptValue} ${pbValue}
          ${style.softwareIntegration}${
          fields.classes ? " " + fields.classes : ""
        } ${fields?.backgroundColor ? fields?.backgroundColor : ""}
        ${transparentiseNavbar ? "transparentized-navbar-transform" : ""}`}
        id={fields.id ? fields.id : null}
        ref={intersectionRef}
        data-transparent-navbar={transparentiseNavbar}
      >
        <div
          className={`container ${narrowContainer ? "max-width-narrow" : ""}`}
        >
          <div className={style.softwareIntegrationContent}>
            <aside>
              <Media media={fields.media} title={fields.mediaTitle} />
            </aside>
            <div>
              <div className={hideHeading ? style.hide : style.heading}>
                <Heading {...heading}></Heading>
              </div>
              {sanitizedHtml && (
                <div
                  className={`content ${style.text}`}
                  dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                ></div>
              )}
              <FirstFoldLink primary />
              <FirstFoldLink />
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      // default firstFold layout
      <>
        <section
          className={`section ${style.firstFold}
          ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
            fields.classes ? fields.classes : ""
          } ${fields?.backgroundColor ? fields?.backgroundColor : ""}
          ${transparentiseNavbar ? "transparentized-navbar-transform" : ""}`}
          id={fields.id ? fields.id : null}
          ref={intersectionRef}
          data-transparent-navbar={transparentiseNavbar}
        >
          <div
            className={`container ${narrowContainer ? "max-width-narrow" : ""}`}
          >
            <div
              className={
                noImageLayout
                  ? style.noImageLayout
                  : `${style.defaultLayout} ${
                      fields.layout == "imageLeft" ? style.imageLeft : ""
                    } ${uncenteredVertically ? "align-items-unset" : ""}`
              }
            >
              <div
                className={`${style.textContent} ${
                  style[`textContentBasis${fields.textWidthPercentage || 50}`]
                }`}
              >
                {fields.headerImage && (
                  <div className={style.headerImage}>
                    <Media media={fields.headerImage} />
                  </div>
                )}
                <div className={hideHeading ? style.hide : style.heading}>
                  <Heading {...heading}></Heading>
                </div>
                {sanitizedHtml && (
                  <div
                    className={`content ${style.text}`}
                    dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                  ></div>
                )}
                {fields.logos && (
                  <div className={`grid-columns ${style.logoGridColumns}`}>
                    {fields.logos.map((logo) => (
                      <div
                        key={logo.contentID}
                        className={`grid-column is-${
                          fields.logos.length >= 6 ? 6 : fields.logos.length
                        } ${style.logoGridColumn}`}
                        data-animate="true"
                      >
                        <Media media={logo.fields.logo} />
                      </div>
                    ))}
                  </div>
                )}
                {fields.testimonial && (
                  <div
                    className={`${style.testimonial} ${testimonialStyle(
                      fields.testimonialStyle
                    )}`}
                    data-animate={
                      fields.testimonialStyle === "quote" ? true : false
                    }
                  >
                    {fields.testimonialStyle === "comment" ? (
                      <div className={style.testimonialIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 47 47"
                          width="100"
                          height="100"
                        >
                          <g
                            stroke="#FFF"
                            strokeWidth="2"
                            fill="none"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 37c-1.656 0-3-1.344-3-3V19c0-1.656 1.344-3 3-3h21c1.656 0 3 1.344 3 3v15c0 1.656-1.344 3-3 3h-3v9l-9-9h-9z"></path>
                            <path d="M13 25l-6 6v-9H4c-1.656 0-3-1.344-3-3V4c0-1.656 1.344-3 3-3h21c1.656 0 3 1.344 3 3v6"></path>
                          </g>
                        </svg>
                      </div>
                    ) : (
                      <div className={style.testimonialIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="36.5"
                          height="28.4"
                          viewBox="0 0 36.5 28.4"
                        >
                          <defs>
                            <style>{`.p{fill:#3398dc;}`}</style>
                          </defs>
                          <path
                            className="p"
                            d="M13.1.2C4.7,3.8,0,10.1,0,17.8S3.4,28.4,8.8,28.4s7.3-2.8,7.3-6.9-2.8-6.4-6.9-6.4H7.9c.6-4.1,3.3-7.2,8.2-9.5l.5-.3L13.5,0Z"
                          ></path>
                          <path
                            className="p"
                            d="M36,5.7l.5-.3L33.4,0,33,.2c-8.5,3.6-13.1,9.9-13.1,17.6s3.4,10.6,8.8,10.6S36,25.6,36,21.5s-2.8-6.4-6.9-6.4H27.8C28.4,11.1,31.1,8,36,5.7Z"
                          ></path>
                        </svg>
                      </div>
                    )}
                    <p>{fields.testimonial.fields.text}</p>
                    <div className={style.testimonialDetails}>
                      <div>
                        {fields.testimonial.fields.companyName && (
                          <p>{fields.testimonial.fields.companyName}</p>
                        )}
                        {fields.testimonial.fields.name && (
                          <p>{fields.testimonial.fields.name}</p>
                        )}
                        {fields.testimonial.fields.jobTitle && (
                          <p>{fields.testimonial.fields.jobTitle}</p>
                        )}
                      </div>
                      {fields.testimonial.fields.image && (
                        <div className={style.testimonialImage}>
                          <Media media={fields.testimonial.fields.image} />
                        </div>
                      )}
                    </div>
                    {fields.testimonial.fields.logo && (
                      <Media media={fields.testimonial.fields.logo} />
                    )}
                  </div>
                )}
                <div className={style.links}>
                  <FirstFoldLink primary />
                  <FirstFoldLink />
                </div>
              </div>
              {(fields.media || fields.videoURL) &&
                !fields.customSVG &&
                !fields.imageLink && (
                  <div
                    className={`${style.image} ${
                      fields.videoURL ? style.isVideo : ""
                    } ${
                      boolean(fields.circularImage)
                        ? style.circularImage
                        : style.removeCircular
                    } ${
                      fields.imageBottomMargin ? fields.imageBottomMargin : ""
                    } ${fields.imageTopMargin ? fields.imageTopMargin : ""} ${
                      fields.linkClasses ? fields.linkClasses : ""
                    } ${
                      style[
                        `mediaBasis${
                          100 - parseInt(fields.textWidthPercentage) || 50
                        }`
                      ]
                    } ${
                      fixedMediaHeight
                        ? style[`defaultLayoutFixedHeight${fixedMediaHeight}`]
                        : ""
                    } ${style[fields.mediaVerticalAlignment]} ${
                      fields.mediaClasses ? fields.mediaClasses : ""
                    }`}
                    data-animate="true"
                  >
                    {fields.videoURL ? (
                      <div className={style.iframeWrapper}>
                        <iframe
                          id="video-player"
                          type="text/html"
                          src={videoSrc}
                          frameBorder="0"
                          allow="fullscreen;"
                        />
                      </div>
                    ) : (
                      <Media
                        media={fields.media}
                        title={fields.mediaTitle}
                        imageOptions={{
                          priority: true,
                          fetchpriority: "high",
                        }}
                      />
                    )}
                  </div>
                )}
              {(fields.media || fields.videoURL) &&
                !fields.customSVG &&
                fields.imageLink && (
                  <AgilityLink
                    agilityLink={fields.imageLink}
                    className={`${style.imageLink} ${
                      fields.imageBottomMargin ? fields.imageBottomMargin : ""
                    } ${fields.linkClasses ? fields.linkClasses : ""} ${
                      style[
                        `mediaBasis${
                          100 - parseInt(fields.textWidthPercentage) || 50
                        }`
                      ]
                    } ${
                      fixedMediaHeight
                        ? style[`defaultLayoutFixedHeight${fixedMediaHeight}`]
                        : ""
                    } ${style[fields.mediaVerticalAlignment]} ${
                      fields.mediaClasses ? fields.mediaClasses : ""
                    }`}
                    ariaLabel={`Navigate to page ` + fields.imageLink.href}
                    title={`Navigate to page ` + fields.imageLink.href}
                  >
                    <div
                      className={`${style.image} ${
                        fields.videoURL ? style.isVideo : ""
                      }`}
                      data-animate="true"
                    >
                      {fields.videoURL ? (
                        <div className={style.iframeWrapper}>
                          <iframe
                            id="video-player"
                            type="text/html"
                            src={videoSrc}
                            frameBorder="0"
                            allow="fullscreen;"
                          />
                        </div>
                      ) : (
                        <Media
                          media={fields.media}
                          title={fields.mediaTitle}
                          imageOptions={{
                            priority: true,
                            fetchpriority: "high",
                          }}
                        />
                      )}
                    </div>
                  </AgilityLink>
                )}
              {fields.customSVG && (
                <CustomSVG
                  svgInput={fields.customSVG}
                  svgClasses={fields.customSVGClasses}
                  animateSVG={animateSVG}
                />
              )}
            </div>
          </div>
        </section>
        {isYouTubeVideo && (
          <Script
            src="https://www.youtube.com/iframe_api"
            onLoad={handleAPIScriptLoad}
          />
        )}
      </>
    );
  }
};

FirstFold.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const firstSanitization = item.fields.text
    ? cleanHtml(item.fields.text)
    : null;
  const sanitizedHtml = item.fields.text
    ? sanitizeHtml(
        firstSanitization,
        textSizeSanitizeConfig(item.fields.textFieldFontSize, false)
      )
    : null;
  return {
    sanitizedHtml,
  };
};

export default FirstFold;
