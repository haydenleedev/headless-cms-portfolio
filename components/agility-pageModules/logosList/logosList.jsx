import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./logosList.module.scss";
const LogosListContent = dynamic(() => import("./logosListContent"));

const LogosList = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;

  fields.items?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.logosList}
      ${
        fields?.borders === "borders-between"
          ? style.borders
          : fields?.borders === "borders-between-padding"
          ? style.bordersPadding
          : ""
      }
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <LogosListContent fields={fields} sanitizedHtml={sanitizedHtml} />
    </section>
  );
};

LogosList.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default LogosList;
