import dynamic from "next/dynamic";
import style from "./callToAction.module.scss";
import { boolean } from "../../../utils/validation";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const CallToActionContent = dynamic(() => import("./callToActionContent"));

const CallToAction = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const bannerLayout = boolean(fields?.bannerLayout);
  const itemContentRight = boolean(fields?.itemContentRight);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.callToAction} 
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        bannerLayout ? style.bannerLayout : ""
      } ${fields.classes ? fields.classes : ""} ${
        itemContentRight ? style.alignRight : style.alignLeft
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <CallToActionContent fields={fields} sanitizedHtml={sanitizedHtml} />
    </section>
  );
};

CallToAction.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.textContent
    ? cleanHtml(item.fields.textContent)
    : null;

  return {
    sanitizedHtml,
  };
};

export default CallToAction;
