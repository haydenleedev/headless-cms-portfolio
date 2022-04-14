import { boolean } from "../../../utils/validation";
import Media from "../media";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";
import style from "./heroImage.module.scss";

const HeroImage = ({ module, narrowHeight, customData }) => {
  const { fields } = module;
  const { sanitizedHtml } = customData || {};
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const containerWidth = fields.width == "container";
  const narrowContainer = fields.width == "narrow";

  return (
    <section
      className={`section ${style.heroImage} ${
        narrowHeight ? style.heroImageNarrowHeight : ""
      } ${
        containerWidth || narrowContainer
          ? `container ${narrowContainer ? "max-width-narrow" : ""}`
          : ""
      } `}
      id={fields.id ? fields.id : null}
    >
      {heading?.text && (
        <div className={`container ${style.overlayText}`}>
          <Heading {...heading} />
          <div
            className={`container content`}
            dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
          ></div>
        </div>
      )}
      {fields.image && <Media media={fields.image} />}
    </section>
  );
};

HeroImage.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.description
    ? cleanHtml(item.fields.description)
    : null;

  return {
    sanitizedHtml,
  };
};

export default HeroImage;
