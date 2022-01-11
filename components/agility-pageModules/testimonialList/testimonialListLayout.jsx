import { useState } from "react";
import Media from "../media";
import Fade from "../../fade/fade";
import style from "./testimonialList.module.scss";
import { sleep } from "../../../utils/generic";
import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import StarRating from "../../starRating/starRating";
import { AgilityImage } from "@agility/nextjs";
import Slider from "../../slider/slider";

// resolves to the selected layout option.
const TestimonialListLayout = (fields) => {
  const [triggerFadeout, setTriggerFadeout] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = fields.testimonials;
  const displayRatings = boolean(fields?.displayRatings);
  const renderAs = fields?.renderAs;

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
  switch (fields.layout) {
    case "staticImageLayout":
      return (
        <>
          {(renderAs === "slider" && (
            <div className={style.staticImageLayoutContent}>
              {fields.image && (
                <div className="d-flex justify-content-center">
                  <Media media={fields.image} />
                </div>
              )}
              <Slider loop dots>
                {testimonials.map((testimonial) => (
                  <div className="d-flex flex-direction-column justify-content-space-between" key={`testimonial${index}`}>
                    <div className={style.staticImageLayoutTextContent}>
                      <StarRating
                        starCount={testimonial.fields?.starCount}
                        starWidth="25"
                      />
                      {testimonial.fields.heading && (
                        <Heading {...JSON.parse(testimonial.fields.heading)} />
                      )}

                      <p>{testimonial.fields.text}</p>
                      <small>–{testimonial.fields.name}</small>
                      <p>{testimonial.fields.jobTitle}</p>
                      <p>{testimonial.fields.companyName}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )) || (
            <div className={style.staticImageLayoutContent}>
              {testimonials[activeIndex] && (
                <>
                  {fields.image && (
                    <div className="d-flex justify-content-center">
                      <Media media={fields.image} />{" "}
                    </div>
                  )}

                  <div className="d-flex flex-direction-column justify-content-space-between">
                    <Fade duration={FADE_DURATION} trigger={triggerFadeout}>
                      <div className={style.staticImageLayoutTextContent}>
                        <StarRating
                          starCount={
                            testimonials[activeIndex].fields?.starCount
                          }
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
                      <ul className={style.dots}>
                        {[...Array(testimonials.length).keys()].map(
                          (key, index) => (
                            <li key={"dot" + key}>
                              <button
                                className={`reset-button ${
                                  activeIndex === index ? style.activeDot : ""
                                }`}
                                onClick={() => handleSetActiveIndex(index)}
                              ></button>
                            </li>
                          )
                        )}
                      </ul>
                      <button
                        onClick={nextIndex}
                        className={`reset-button ${style.button}`}
                      ></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      );
    case "gridLayout":
      return (
        <div id={style.testimonialGrid}>
          {testimonials.map((testimonial, index) => {
            return (
              <div className={style.gridItem} key={`testimonial${index}`}>
                {fields.awards[index]?.fields.image?.url ? (
                  <div className={style.gridItemLogoContainer}>
                    <AgilityImage
                      className={style.gridItemLogo}
                      src={fields.awards[index].fields.image.url}
                      layout="fill"
                      objectFit="contain"
                      width={0}
                      height={0}
                    />
                  </div>
                ) : (
                  <div className={style.gridItemLogoPlaceholder} />
                )}
                {displayRatings && (
                  <StarRating
                    starCount={testimonial.starCount}
                    starWidth="25"
                  />
                )}
                <p className={style.gridItemText}>{testimonial.fields.text}</p>
                <p className={style.gridItemName}>{testimonial.fields.name}</p>
              </div>
            );
          })}
        </div>
      );
    default:
      return (
        <>
          {(renderAs === "slider" && (
            <Slider loop>
              {testimonials.map((testimonial) => (
                <div className={style.content} key={testimonial.contentID}>
                  {testimonial && (
                    <>
                      <div className={style.mediaWrapper}>
                        {testimonial.fields.image && (
                          <div className={style.media}>
                            <Media media={testimonial.fields.image} />
                          </div>
                        )}
                      </div>

                      <div className="d-flex flex-direction-column justify-content-space-between">
                        <div className={style.textContent}>
                          <p>{testimonial.fields.text}</p>
                          <p>{testimonial.fields.name}</p>
                          <p>{testimonial.fields.jobTitle}</p>
                          <p>{testimonial.fields.companyName}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </Slider>
          )) || (
            <div className={style.content}>
              {testimonials[activeIndex] && (
                <>
                  <div className={style.mediaWrapper}>
                    {testimonials[activeIndex].fields.image && (
                      <Fade duration={FADE_DURATION} trigger={triggerFadeout}>
                        <div className={style.media}>
                          <Media
                            media={testimonials[activeIndex].fields.image}
                          />
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
        </>
      );
  }
};

export default TestimonialListLayout;
