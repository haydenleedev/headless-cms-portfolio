import { useState } from "react";
import style from "./textWithForm.module.scss";
import { Form, FormWrapper } from "../../form";
import { boolean } from "../../../utils/validation";
import Media from "../media";
import StarRating from "../../starRating/starRating";
const TextWithForm = ({ module }) => {
  const [formLoaded, setFormLoaded] = useState(false);
  const { fields } = module;
  const narrowContainer = boolean(fields?.narrowContainer);
  const columnLayout = boolean(fields?.columnLayout);

  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };

  return (
    <FormWrapper handleSetFormLoaded={handleSetFormLoaded}>
      <section
        className={`section ${style.textWithForm} ${
          fields.classes ? fields.classes : ""
        }`}
      >
        <div
          className={`container ${narrowContainer ? "max-width-narrow" : ""}`}
        >
          <div
            className={columnLayout ? style.columnLayoutContent : style.content}
          >
            <aside className={style.textContent}>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: fields.text }}
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
              />
            </aside>
          </div>
        </div>
      </section>
    </FormWrapper>
  );
};

export default TextWithForm;
