import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";
import { boolean } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import Media from "../media";
import style from "./textWithMedia.module.scss";

const TextWithMedia = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  //configuration options
  const narrowContainer = boolean(fields?.narrowContainer);
  const fullPageWidth = boolean(fields?.fullPageWidth);
  const columnLayout = boolean(fields?.columnLayout);
  const mediaLeft = boolean(fields?.mediaLeft);
  const headingOnTop = boolean(fields?.headingOnTop);
  const headingSizeforTextArea = fields.headingSizeforTextArea;
  const mediaVerticalAlignment = fields.mediaVerticalAlignment;
  const textContentVerticalAlignment = fields.textContentVerticalAlignment;
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

  return (
    <section
      className={`section ${style.textWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div
        className={`container ${narrowContainer ? "max-width-narrow" : ""} ${
          fullPageWidth ? "max-width-unset padding-unset" : ""
        }`}
      >
        {headingOnTop && heading.text && (
          <div
            className={`${columnLayout ? "heading" : style.heading} ${
              fields.headingAlignment
            }`}
          >
            <Heading {...heading} />
          </div>
        )}
        <div
          className={`${style.content} ${
            columnLayout
              ? "flex-direction-column justify-content-center align-items-center"
              : mediaLeft
              ? "flex-direction-row-reverse"
              : "flex-direction-row"
          } ${fullPageWidth ? style.fullPageWidthContent : ""}`}
        >
          <div
            className={`${style.textContent} ${
              fullPageWidth ? style.fullPageWidthTextContent : ""
            } ${
              style[`textContentBasis${fields.textWidthPercentage || 50}`]
            } ${textContentVerticalAlignment}`}
          >
            <div
              className={`${
                columnLayout
                  ? "justify-content-center align-items-center"
                  : mediaLeft
                  ? "justify-content-flex-end align-items-flex-start"
                  : "justify-content-flex-start align-items-flex-start"
              }`}
            >
              {!headingOnTop && heading.text && (
                <div className={columnLayout ? "heading" : style.heading}>
                  <Heading {...heading} />
                </div>
              )}
              {fields.text && (
                <div
                  className={`${style.html} content ${
                    headingSizeforTextArea ? headingSizeforTextArea : ""
                  }`}
                  dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                ></div>
              )}
              {fields.link && (
                <AgilityLink
                  agilityLink={fields.link}
                  className={`${
                    !columnLayout && !fields.linkClasses ? "small" : ""
                  } cyan outlined ${style.link} ${
                    fields.linkClasses ? fields.linkClasses : ""
                  } ${fields.linkStyle ? fields.linkStyle : "button pl-4 pr-4"}`}
                  ariaLabel={`Navigate to page ` + fields.link.href}
                  title={`Navigate to page ` + fields.link.href}
                >
                  {fields.link.text}
                </AgilityLink>
              )}
            </div>
          </div>
          <div
            className={`${style.media} ${
              fullPageWidth ? style.fullPageWidthMedia : ""
            } ${mediaVerticalAlignment} ${
              style[
                `mediaBasis${100 - parseInt(fields.textWidthPercentage) || 50}`
              ]
            } ${style[`${fields.mediaPadding}`]}
            `}
          >
            <div data-animate="true">
              {fields.media && !fields.testimonial && (
                <Media media={fields.media} />
              )}
            </div>
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
                  <div className={style.testimonialIcon} data-animate="true">
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
                  <div className={style.testimonialIcon} data-animate="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36.5"
                      height="28.4"
                      viewBox="0 0 36.5 28.4"
                      className="bounce is-inView"
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
          </div>
        </div>
      </div>
    </section>
  );
};

TextWithMedia.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default TextWithMedia;
