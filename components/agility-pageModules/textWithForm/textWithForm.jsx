import { useState } from "react";
import style from "./textWithForm.module.scss";
import { Form, FormWrapper } from "../../form";
import { boolean } from "../../../utils/validation";
import Media from "../media";
import StarRating from "../../starRating/starRating";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";

const TextWithForm = ({ module, customData }) => {
  const { sanitizedHtml, featuredAwards } = customData;
  const { fields } = module;
  const [formLoaded, setFormLoaded] = useState(false);
  const narrowContainer = boolean(fields?.narrowContainer);
  const columnLayout = boolean(fields?.columnLayout);
  const formLeft = boolean(fields?.formLeft);
  const showAwards = boolean(fields?.showAwards);
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const subheading = fields.subheading ? JSON.parse(fields.subheading) : null;

  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };

  return (
    <FormWrapper
      handleSetFormLoaded={handleSetFormLoaded}
      formID={fields.marketoFormID}
    >
      <section
        className={`section ${style.textWithForm} ${
          fields.classes ? fields.classes : ""
        }`}
        id={fields.id ? fields.id : null}
      >
        <div
          className={`container ${narrowContainer ? "max-width-narrow" : ""}`}
        >
          <div
            className={
              columnLayout
                ? style.columnLayoutContent
                : `${style.content} ${
                    formLeft
                      ? "flex-direction-row-reverse"
                      : "flex-direction-row"
                  }`
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
                <Form
                  submitButtonText={fields.formSubmitText}
                  formLoaded={formLoaded}
                  formID={fields.marketoFormID}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </FormWrapper>
  );
};

const FormLoader = () => {
  return (
    <form id="mktoForm_loader" className={style.loader}>
      {[...Array(8).keys()].map((key) => (
        <div className="mktoFormRow" key={key}>
          <div className="mktoFieldDescriptor mktoFormCol">
            <div className="mktoFieldWrap">
              <label className="mktoLabel">᠎</label>
              <input className="mktoField mktoHasWidth" disabled></input>
            </div>
          </div>
        </div>
      ))}
      <div>
        <button className="mktoButton">᠎</button>
      </div>
    </form>
  );
}

TextWithForm.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;
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

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
    featuredAwards,
  };
};

export default TextWithForm;
export { FormLoader };