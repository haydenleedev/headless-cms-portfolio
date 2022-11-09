import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const Media = dynamic(() => import("../media"), { ssr: false });
import style from "./heroImage.module.scss";

const HeroImage = ({ module, narrowHeight, customData }) => {
  const { fields } = module;
  const { sanitizedHtml } = customData || {};
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const containerWidth = fields.width == "container";
  const narrowContainer = fields.width == "narrow";

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.heroImage}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
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
