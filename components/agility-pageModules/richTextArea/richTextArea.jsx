import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./richTextArea.module.scss";
import { textSizeSanitizeConfig } from "../../../utils/convert";
const RichTextAreaContent = dynamic(() => import("./richTextAreaContent"), {
  ssr: false,
});

const RichTextArea = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";
  return (
    <section
      className={`section ${
        style.richTextArea
      } ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      } ${fields.classes ? fields.classes : ""}`}
      id={fields.id ? fields.id : null}
    >
      <RichTextAreaContent fields={fields} sanitizedHtml={sanitizedHtml} />
    </section>
  );
};

RichTextArea.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  const firstSanitization = item.fields.textblob
    ? cleanHtml(item.fields.textblob)
    : null;
  const sanitizedHtml = sanitizeHtml(
    firstSanitization,
    textSizeSanitizeConfig(
      item.fields.bodyTextFontSize,
      item.fields.headingFontSize
    )
  );
  return {
    sanitizedHtml,
  };
};

export default RichTextArea;
