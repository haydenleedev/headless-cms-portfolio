import style from "./textWithForm.module.scss";
import { boolean } from "../../../utils/validation";
import Media from "../media";
import StarRating from "../../starRating/starRating";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";
import PardotForm from "../../form/pardotForm";
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";

const TextWithForm = ({ module, customData }) => {
  const { sanitizedHtml, featuredAwards, formConfiguration } = customData;
  const { fields } = module;
  const { campaignScriptIDRef } = useContext(GlobalContext);
  const narrowContainer = boolean(fields?.narrowContainer);
  const columnLayout = fields.layout == "column";
  const formLeft = fields.layout == "formLeft";
  const showAwards = boolean(fields?.showAwards);
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const subheading = fields.subheading ? JSON.parse(fields.subheading) : null;

  fields.testimonials?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  fields.featuredAwards?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  useEffect(() => {
    campaignScriptIDRef.current = fields.campaignTrackingID;
  }, []);

  return (
    <section
      className={`section ${style.textWithForm} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        <div
          className={
            columnLayout
              ? style.columnLayoutContent
              : `${style.content} ${formLeft ? style.formLeft : ""}`
          }
        >
          {(heading || subheading) && (
            <aside className={style.columnLayoutHeading}>
              {heading && <Heading {...heading} />}
              {subheading && <Heading {...subheading} />}
            </aside>
          )}
          <aside className={style.textContent}>
            {(heading || subheading) && (
              <div className={style.rowLayoutHeading}>
                {heading && <Heading {...heading} />}
                {subheading && <Heading {...subheading} />}
              </div>
            )}
            <div
              className="content"
              dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
            ></div>

            {fields.testimonials && (
              <div className={`columns repeat-2 ${style.testimonials}`}>
                {fields.testimonials.map((testimonial) => (
                  <div
                    key={testimonial.contentID}
                    className={style.testimonial}
                  >
                    <StarRating
                      starCount={testimonial.fields?.starCount}
                      starWidth="25"
                    />
                    <p>{testimonial.fields.text}</p>
                    <small>–{testimonial.fields.name}</small>
                  </div>
                ))}
              </div>
            )}
            {showAwards && featuredAwards && (
              <div className={`grid-columns ${style.awardImages}`}>
                {featuredAwards.map((award) => (
                  <div
                    key={award.contentID}
                    className={`grid-column is-${featuredAwards.length} ${style.awardImage}`}
                  >
                    <Media media={award.fields.image} />
                  </div>
                ))}
              </div>
            )}
          </aside>
          <aside className={style.form}>
            <div
              className={`${style.sideWrapper} ${style["bg-skyblue-light"]}`}
            >
              <PardotForm
                formHandlerID={fields.pardotFormID}
                config={formConfiguration}
                action={fields.formAction}
                submit={
                  fields.formSubmitText
                    ? fields.formSubmitText
                    : "Request a Demo"
                }
                stepsEnabled={fields.formStepsEnabled}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

TextWithForm.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;

  // console.log("<<<<<<<< Pardot form data: ", JSON.stringify(pardotFormData));
  // TODO: parse pardot form HTML if it's possible. Might not be in case it's returned only inside the embed iFrame...

  let featuredAwards = await api.getContentList({
    referenceName: "featuredawards",
    languageCode,
    languageCode,
    sort: "properties.itemOrder",
    direction: "desc",
    expandAllContentLinks: true,
    take: 7,
  });
  featuredAwards = featuredAwards.items[0].fields.awards;

  const formConfiguration = await api.getContentList({
    referenceName: "formconfiguration",
    expandAllContentLinks: true,
    languageCode,
  });

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
    featuredAwards,
    formConfiguration,
  };
};

export default TextWithForm;
