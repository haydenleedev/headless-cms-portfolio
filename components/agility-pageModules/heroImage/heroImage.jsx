import { boolean } from "../../../utils/validation";
import Media from "../media";
import style from "./heroImage.module.scss";

const HeroImage = ({ module }) => {
  const { fields } = module;
  const containerWidth = boolean(fields.containerWidth);
  return (
    <section
      className={`section ${style.heroImage} ${
        containerWidth ? "container" : ""
      }`}
    >
      {fields.image && <Media media={fields.image} />}
    </section>
  );
};

export default HeroImage;
