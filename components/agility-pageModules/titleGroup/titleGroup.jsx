import Heading from "../heading";
import { useIntersectionObserver } from "../../../utils/hooks";
import style from "./titleGroup.module.scss";

const TitleGroup = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  //configuration options
  const narrowContainer = fields.containerWidth == "narrow";
  const fullPageWidth = fields.containerWidth == "fullPageWidth";

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
      className={`section ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div
        className={`container ${narrowContainer ? "max-width-narrow" : ""} ${
          fullPageWidth ? "max-width-unset padding-unset" : ""
        }`}
      >
        {(heading.text || fields.subHeading) && (
          <div className={`${fields.headingAlignment}`}>
            {heading.text && <Heading {...heading} />}
            <p
              className={`text ${
                fields.subHeadingClass ? fields.subHeadingClass : ""
              }`}
            >
              {fields.subHeading && fields.subHeading}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TitleGroup;
