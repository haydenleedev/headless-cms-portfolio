import style from "./brandFirstFold.module.scss";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";
import dynamic from "next/dynamic";
const BrandFirstFoldContent = dynamic(()=> import("./brandFirstFoldContent/brandFirstFoldContent"), {ssr:false});

const BrandFirstFold = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;

  // observer for triggering animations if an animation style is selected in agility.
  const intersectionRef = useIntersectionObserver(
    {
      threshold: 0.0,
    },
    0.0,
    fields.animationStyle
      ? () => {
          intersectionRef.current
            .querySelectorAll('*[data-animate="true"]')
            .forEach((elem) => {
              elem.classList.add(fields.animationStyle);
            });
        }
      : null
  );

  return (
    <section
      className={`section ${style.firstFold} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    > <BrandFirstFoldContent fields={fields} sanitizedHtml={sanitizedHtml} /></section>
  );
};

BrandFirstFold.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default BrandFirstFold;
