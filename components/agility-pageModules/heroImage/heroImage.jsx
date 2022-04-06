import { boolean } from "../../../utils/validation";
import Media from "../media";
import Heading from "../heading";
import style from "./heroImage.module.scss";

const HeroImage = ({ module, narrowHeight }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const containerWidth = boolean(fields.containerWidth);
  const narrowContainer = boolean(fields?.narrowContainer);

  return (
    <section
      className={`section ${style.heroImage} ${
        narrowHeight ? style.heroImageNarrowHeight : ""
      } ${containerWidth ? "container" : ""} ${
        narrowContainer ? "max-width-narrow" : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      {heading && (
        <div className={`container ${style.overlayText}`}>
          <Heading {...heading} />
        </div>
      )}
      {fields.image && <Media media={fields.image} />}
    </section>
  );
};

export default HeroImage;
