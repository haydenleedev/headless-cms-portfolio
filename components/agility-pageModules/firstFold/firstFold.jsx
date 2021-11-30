import Heading from "../heading";
import style from "./firstFold.module.scss";
import Media from "../media";
import { boolean } from "../../../utils/validation";
import GoogleCloudAnimation from "./googleCloudAnimation";
import AgilityLink from "../../agilityLink";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";

const FirstFold = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const alternateLayout = boolean(fields.alternateLayout);
  const noImageLayout = boolean(fields.noImageLayout);
  const customerStory = boolean(fields.customerStory);
  const narrowContainer = boolean(fields?.narrowContainer);
  const googleCloudAnimation = boolean(fields?.googleCloudAnimation);

  // helper function to determine which testimonial module class should be used.
  const testimonialStyle = (value) => {
    if (value === "quote") return style.testimonialQuote;
    return style.testimonialComment;
  };

  // different layout when alternateLayout or customerStory is toggled on
  return alternateLayout || customerStory ? (
    <section
      className={`section ${style.firstFoldAlternate} ${
        customerStory ? "mb-6" : ""
      } ${fields.classes ? fields.classes : ""}`}
    >
      {fields.media && (
        <div className={style.backgroundImage}>
          <Media media={fields.media}></Media>
        </div>
      )}
      <div
        className={`container ${
          customerStory ? style.customerStoryTextContent : style.textContent
        } ${narrowContainer ? "max-width-narrow" : ""}`}
      >
        <div className={style.heading}>
          <Heading {...heading}></Heading>
        </div>
        {fields.text && (
          <div
            className={`content ${style.text}`}
            dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
          ></div>
        )}
        {fields.primaryLink && (
          <AgilityLink
            agilityLink={fields.primaryLink}
            className={`button cyan outlined ${style.primaryLink} ${
              fields.linkClasses ? fields.linkClasses : ""
            }`}
            ariaLabel={`Navigate to page ` + fields.primaryLink.href}
            title={`Navigate to page ` + fields.primaryLink.href}
          >
            {fields.primaryLink.text}
          </AgilityLink>
        )}
        {fields.secondaryLink && (
          <AgilityLink
            agilityLink={fields.secondaryLink}
            className={`button ${style.secondaryLink} ${
              fields.linkClasses ? fields.linkClasses : ""
            }`}
            ariaLabel={`Navigate to page ` + fields.secondaryLink.href}
            title={`Navigate to page ` + fields.secondaryLink.href}
          >
            {fields.secondaryLink.text}
          </AgilityLink>
        )}
      </div>
    </section>
  ) : (
    // default firstFold layout
    <section
      className={`section ${style.firstFold} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        {/* TODO: allow reverse column order for desktop as a conditional toggle from Agility*/}
        <div
          className={noImageLayout ? style.noImageLayout : "columns repeat-2"}
        >
          <div className={style.textContent}>
            <div className={style.heading}>
              <Heading {...heading}></Heading>
            </div>
            {fields.text && (
              <div
                className={`content ${style.text}`}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              ></div>
            )}
            {fields.logos && (
              <div className="grid-columns">
                {fields.logos.map((logo) => (
                  <div key={logo.contentID} className="grid-column is-6">
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
            <div className={style.links}>
              {fields.primaryLink && (
                <AgilityLink agilityLink={fields.primaryLink}>
                  <a
                    className={`button cyan outlined ${style.primaryLink} ${
                      fields.linkClasses ? fields.linkClasses : ""
                    }`}
                    aria-label={`Navigate to page ` + fields.primaryLink.href}
                    title={`Navigate to page ` + fields.primaryLink.href}
                  >
                    {fields.primaryLink.text}
                  </a>
                </AgilityLink>
              )}
              {fields.secondaryLink && (
                <AgilityLink
                  agilityLink={fields.secondaryLink}
                  className="button outlined"
                >
                  <a
                    className={`button ${style.secondaryLink} ${
                      fields.linkClasses ? fields.linkClasses : ""
                    }`}
                    aria-label={`Navigate to page ` + fields.secondaryLink.href}
                    title={`Navigate to page ` + fields.secondaryLink.href}
                  >
                    {fields.secondaryLink.text}
                  </a>
                </AgilityLink>
              )}
            </div>
          </div>
          {fields.media && !noImageLayout && !googleCloudAnimation && (
            <div className={style.image}>
              <Media media={fields.media}></Media>
            </div>
          )}
          {googleCloudAnimation && !noImageLayout && <GoogleCloudAnimation />}
        </div>
      </div>
    </section>
  );
};

FirstFold.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default FirstFold;
