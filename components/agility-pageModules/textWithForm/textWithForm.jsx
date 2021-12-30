import { useState } from "react";
import style from "./textWithForm.module.scss";
import { Form, FormWrapper } from "../../form";
import { boolean } from "../../../utils/validation";
import Media from "../media";
import StarRating from "../../starRating/starRating";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const TextWithForm = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const [formLoaded, setFormLoaded] = useState(false);
  const narrowContainer = boolean(fields?.narrowContainer);
  const columnLayout = boolean(fields?.columnLayout);
  const formLeft = boolean(fields?.formLeft);

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
        } ${columnLayout ? "padding-block-3" : ""}`}
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
            <aside className={style.textContent}>
              <div
                className="content"
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              ></div>

              {fields.testimonials && (
                <div className="columns repeat-2">
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
              {fields.awardImages && (
                <div className={`grid-columns ${style.awardImages}`}>
                  {fields.awardImages.map((award) => (
                    <div
                      key={award.contentID}
                      className={`grid-column is-${fields.awardImages.length} ${style.awardImage}`}
                    >
                      <Media media={award.fields.image} />
                    </div>
                  ))}
                </div>
              )}
            </aside>
            <aside className={style.form}>
              <Form
                submitButtonText={fields.formSubmitText}
                formLoaded={formLoaded}
                formID={fields.marketoFormID}
              />
            </aside>
          </div>
        </div>
      </section>
    </FormWrapper>
  );
};

TextWithForm.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default TextWithForm;
