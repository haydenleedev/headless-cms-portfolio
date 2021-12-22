import { boolean } from "../../../utils/validation";
import Media from "../media";
import style from "./heroImage.module.scss";

const HeroImage = ({ module, narrowHeight }) => {
  const { fields } = module;
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
      {fields.image && <Media media={fields.image} />}
    </section>
  );
};

export default HeroImage;
