import { useIntersectionObserver } from "../../../utils/hooks";
import Heading from "../heading";
import style from "./title.module.scss";

const Title = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  //configuration options
  const narrowContainer = boolean(fields?.narrowContainer);
  const fullPageWidth = boolean(fields?.fullPageWidth);

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

  return (
    <section
      className={`section ${style.heading} ${
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
        {heading.text && (
          <div
            className={`${columnLayout ? "heading" : style.heading} ${
              fields.headingAlignment
            }`}
          >
            <Heading {...heading} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Title;
