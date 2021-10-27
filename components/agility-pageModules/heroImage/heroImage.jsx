import Media from "../media";
import style from "./heroImage.module.scss";

const HeroImage = ({ module }) => {
  const { fields } = module;
  return (
    <section className={`section ${style.heroImage}`}>
      {fields.image && <Media media={fields.image} />}
    </section>
  );
};

export default HeroImage;
