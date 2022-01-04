import { useState } from "react";
import Media from "../media";
import Fade from "../../fade/fade";
import style from "./testimonialList.module.scss";
import { sleep } from "../../../utils/generic";
import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import StarRating from "../../starRating/starRating";

const TestimonialList = ({ module }) => {
  const [triggerFadeout, setTriggerFadeout] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { fields } = module;
  const testimonials = fields.testimonials;
  const staticImageLayout = boolean(fields?.staticImageLayout);
  const displayRatings = boolean(fields?.displayRatings);
  const FADE_DURATION = 300;
  const previousIndex = () => {
    setTriggerFadeout(!triggerFadeout);
    sleep(FADE_DURATION).then(() => {
      if (activeIndex - 1 >= 0) setActiveIndex(activeIndex - 1);
      else setActiveIndex(testimonials.length - 1);
    });
  };
  const nextIndex = () => {
    setTriggerFadeout(!triggerFadeout);
    sleep(FADE_DURATION).then(() => {
      if (activeIndex + 1 <= testimonials.length - 1)
        setActiveIndex(activeIndex + 1);
      else setActiveIndex(0);
    });
  };
  const handleSetActiveIndex = (index) => {
    setTriggerFadeout(!triggerFadeout);
    sleep(FADE_DURATION).then(() => {
      setActiveIndex(index);
    });
  };
  return (
    <section
      className={`section ${style.testimonialList} ${
        fields.classes ? fields.classes : "bg-lightgray"
      }`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        {staticImageLayout ? (
          <div className={style.content}>
            {testimonials[activeIndex] && (
              <>
                {fields.image && <Media media={fields.image} />}

                <div className="d-flex flex-direction-column justify-content-space-between">
                  <Fade duration={FADE_DURATION} trigger={triggerFadeout}>
                    <div className={style.staticImageLayoutTextContent}>
                      <StarRating
                        starCount={testimonials[activeIndex].fields?.starCount}
                        starWidth="25"
                      />
                      {testimonials[activeIndex].fields.heading && (
                        <Heading
                          {...JSON.parse(
                            testimonials[activeIndex].fields.heading
                          )}
                        />
                      )}

                      <p>{testimonials[activeIndex].fields.text}</p>
                      <small>–{testimonials[activeIndex].fields.name}</small>
                      <p>{testimonials[activeIndex].fields.jobTitle}</p>
                      <p>{testimonials[activeIndex].fields.companyName}</p>
                    </div>
                  </Fade>
                  <div className={style.staticImageLayoutControls}>
                    <div className={style.dots}>
                      {[...Array(testimonials.length).keys()].map(
                        (key, index) => (
                          <button
                            key={"dot" + key}
                            className={`reset-button ${
                              activeIndex === index ? style.activeDot : ""
                            }`}
                            onClick={() => handleSetActiveIndex(index)}
                          ></button>
                        )
                      )}
                    </div>
                    <button
                      onClick={nextIndex}
                      className={`reset-button ${style.button}`}
                    ></button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={style.content}>
            {testimonials[activeIndex] && (
              <>
                <div className={style.mediaWrapper}>
                  {testimonials[activeIndex].fields.image && (
                    <Fade duration={FADE_DURATION} trigger={triggerFadeout}>
                      <div className={style.media}>
                        <Media media={testimonials[activeIndex].fields.image} />
                      </div>
                    </Fade>
                  )}
                </div>

                <div className="d-flex flex-direction-column justify-content-space-between">
                  <Fade duration={FADE_DURATION} trigger={triggerFadeout}>
                    <div className={style.textContent}>
                      <p>{testimonials[activeIndex].fields.text}</p>
                      <p>{testimonials[activeIndex].fields.name}</p>
                      <p>{testimonials[activeIndex].fields.jobTitle}</p>
                      <p>{testimonials[activeIndex].fields.companyName}</p>
                    </div>
                    <div className={style.controls}>
                      <button
                        onClick={previousIndex}
                        className={`reset-button ${style.button}`}
                      ></button>
                      <button
                        onClick={nextIndex}
                        className={`reset-button ${style.button}`}
                      ></button>
                    </div>
                  </Fade>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialList;
