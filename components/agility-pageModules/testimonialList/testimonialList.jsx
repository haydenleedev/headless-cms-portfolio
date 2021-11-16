import { useState } from "react";
import Media from "../media";
import Fade from "../../fade/fade";
import style from "./testimonialList.module.scss";
import { sleep } from "../../../utils/generic";

const TestimonialList = ({ module }) => {
  const [triggerFadeout, setTriggerFadeout] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { fields } = module;
  const testimonials = fields.testimonials;
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
  return (
    <section
      className={`section ${style.testimonialList} bg-radial-gradient-top`}
    >
      <div className="container">
        <div className={style.content}>
          {testimonials[activeIndex] && (
            <>
              <div className={style.mediaWrapper}>
                <Fade duration={FADE_DURATION} trigger={triggerFadeout}>
                  <div className={style.media}>
                    <Media media={testimonials[activeIndex].fields.image} />
                  </div>
                </Fade>
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
      </div>
    </section>
  );
};

export default TestimonialList;
