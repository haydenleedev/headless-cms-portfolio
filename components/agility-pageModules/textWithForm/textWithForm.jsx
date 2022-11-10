import dynamic from "next/dynamic";
import style from "./textWithForm.module.scss";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const TextWithFormContent = dynamic(() => import("./textWithFormContent"), {
  ssr: false,
});

const TextWithForm = ({ module, customData }) => {
  const { sanitizedHtml, featuredAwards, formConfiguration } = customData;
  const { fields } = module;

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.textWithForm}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <TextWithFormContent
        fields={fields}
        sanitizedHtml={sanitizedHtml}
        featuredAwards={featuredAwards}
        formConfiguration={formConfiguration}
      />
    </section>
  );
};

TextWithForm.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;

  // console.log("<<<<<<<< Pardot form data: ", JSON.stringify(pardotFormData));
  // TODO: parse pardot form HTML if it's possible. Might not be in case it's returned only inside the embed iFrame...

  let featuredAwards = await api.getContentList({
    referenceName: "featuredawards",
    languageCode,
    languageCode,
    sort: "properties.itemOrder",
    direction: "desc",
    expandAllContentLinks: true,
    take: 7,
  });
  featuredAwards = featuredAwards.items[0].fields.awards;

  const formConfiguration = await api.getContentList({
    referenceName: "formconfiguration",
    expandAllContentLinks: true,
    languageCode,
  });

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
    featuredAwards,
    formConfiguration,
  };
};

export default TextWithForm;
