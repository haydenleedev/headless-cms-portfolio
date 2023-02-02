import dynamic from "next/dynamic";
import { boolean } from "../../../utils/validation";
import style from "./clientTestimonial.module.scss";
const Media = dynamic(() => import("../media"));
const StarRating = dynamic(() => import("../../starRating/starRating"));
const AgilityLink = dynamic(() => import("../../agilityLink"));
import { useIntersectionObserver } from "../../../utils/hooks";

const ClientTestimonial = ({ module }) => {
  const { fields } = module;
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

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.clientTestimonial} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      } ${
        fields.testimonialStyle === "logo-left-text-right"
          ? `pb-6 ${style.logoOnLeft}`
          : ""
      } ${
        fields.testimonialStyle === "text-left-logo-right"
          ? `pb-6 ${style.logoOnLeft} ${style.logoOnRight}`
          : ""
      } ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      {fields.backgroundImage && (
        <div className={style.backgroundImage}>
          <Media media={fields.backgroundImage} />
        </div>
      )}
      <div className="container">
        {fields.testimonial && (
          <div className={style.content}>
            {boolean(fields.slim) ? (
              <div className={style.slim}>
                {fields?.award?.fields?.image && (
                  <div className={style.awardImage}>
                    <Media
                      media={fields.award.fields.image}
                      width={360}
                      height={360}
                    />
                  </div>
                )}
                {fields.testimonial.fields?.text && (
                  <div className={style.textContent} data-animate="true">
                    {boolean(fields.displayRating) && (
                      <StarRating
                        starCount={fields.testimonial?.starCount}
                        starWidth="25"
                      />
                    )}
                    <p
                      className={`${style.quote} ${
                        fields.testimonial.fields.textClass
                          ? fields.testimonial.fields.textClass
                          : "null"
                      }`}
                    >
                      {fields.testimonial.fields.text}
                    </p>
                    <div className={style.client}>
                      <p>{fields.testimonial.fields.name}</p>
                      <p>
                        {fields.testimonial.fields.jobTitle
                          ? `${fields.testimonial.fields.jobTitle}`
                          : ""}
                      </p>
                      <p>
                        {fields.testimonial.fields.companyName
                          ? `${fields.testimonial.fields.companyName}`
                          : ""}
                      </p>
                    </div>
                    {fields.link && (
                      <AgilityLink
                        agilityLink={fields.link}
                        className={`chevron-style ${style.slimLink}`}
                        ariaLabel={`Navigate to page ` + fields.link.href}
                        title={`Navigate to page ` + fields.link.href}
                      >
                        {fields.link.text}
                      </AgilityLink>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={style.normal}>
                {fields?.award?.fields?.image && (
                  <div className={style.awardImage}>
                    <Media
                      media={fields.award.fields.image}
                      width={360}
                      height={360}
                    />
                  </div>
                )}
                {fields.testimonial.fields?.text && (
                  <div className={style.textContent} data-animate="true">
                    {boolean(fields.displayRating) && (
                      <StarRating
                        starCount={fields.testimonial?.starCount}
                        starWidth="25"
                      />
                    )}
                    <p
                      className={`${style.quote} ${
                        fields.testimonial.fields.textClass
                          ? fields.testimonial.fields.textClass
                          : "null"
                      }`}
                    >
                      {fields.testimonial.fields.text}
                      {(fields.testimonialStyle === "text-left-logo-right" ||
                        fields.testimonialStyle === "logo-left-text-right") && (
                        <>
                          {fields.testimonial.fields.name && (
                            <span className={style.clientName}>
                              {fields.testimonial.fields.name}
                            </span>
                          )}
                          {fields.testimonial.fields.jobTitle && (
                            <span className={style.jobTitle}>
                              {fields.testimonial.fields.jobTitle}
                            </span>
                          )}
                          {fields.testimonial.fields.companyName && (
                            <p className={style.companyName}>
                              {fields.testimonial.fields.companyName}
                            </p>
                          )}
                          {fields.link && (
                            <AgilityLink
                              agilityLink={fields.link}
                              className={`button ${
                                fields.cTALinkColor
                                  ? fields.cTALinkColor
                                  : "white"
                              } ${
                                fields.cTALinkSize
                                  ? fields.cTALinkSize
                                  : "small"
                              } ${style.link}`}
                              ariaLabel={`Navigate to page ` + fields.link.href}
                              title={`Navigate to page ` + fields.link.href}
                            >
                              {fields.link.text}
                            </AgilityLink>
                          )}
                        </>
                      )}
                    </p>
                    <div className={style.client}>
                      {fields.testimonialStyle !== "text-left-logo-right" &&
                        fields.testimonialStyle !== "logo-left-text-right" && (
                          <>
                            {fields.testimonial.fields.name && (
                              <p className={style.clientName}>
                                {fields.testimonial.fields.name}
                              </p>
                            )}
                            {fields.testimonial.fields.jobTitle && (
                              <p className={style.jobTitle}>
                                {fields.testimonial.fields.jobTitle}
                              </p>
                            )}
                            {fields.testimonial.fields.companyName && (
                              <p className={style.companyName}>
                                {fields.testimonial.fields.companyName}
                              </p>
                            )}
                          </>
                        )}
                      {fields.testimonial.fields.logo && (
                        <div
                          className={`${style.logo}${
                            fields.testimonial.fields.logoSizeBig
                              ? " " + style.logoBig
                              : null
                          }`}
                        >
                          <Media
                            media={fields.testimonial.fields.logo}
                            width={360}
                            height={360}
                          />
                        </div>
                      )}
                    </div>
                    {fields.link &&
                      fields.testimonialStyle !== "text-left-logo-right" &&
                      fields.testimonialStyle !== "logo-left-text-right" && (
                        <AgilityLink
                          agilityLink={fields.link}
                          className={`button ${
                            fields.cTALinkColor ? fields.cTALinkColor : "white"
                          } ${
                            fields.cTALinkSize ? fields.cTALinkSize : "small"
                          } ${style.link}`}
                          ariaLabel={`Navigate to page ` + fields.link.href}
                          title={`Navigate to page ` + fields.link.href}
                        >
                          {fields.link.text}
                        </AgilityLink>
                      )}
                  </div>
                )}
              </div>
            )}
            {/* fields.link && (
              <AgilityLink
                agilityLink={fields.link}
                className={`button white small ${style.link}`}
                ariaLabel={`Navigate to page ` + fields.link.href}
                title={`Navigate to page ` + fields.link.href}
              >
                {fields.link.text}
              </AgilityLink>
            ) */}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientTestimonial;
