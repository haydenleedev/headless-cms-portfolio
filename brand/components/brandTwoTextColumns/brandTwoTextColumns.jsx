import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";
const BrandTwoTextColumnsContent = dynamic(
  () => import("./brandTwoTextColumnsContent"),
  { ssr: false }
);

const BrandTwoTextColumns = ({ module, customData }) => {
  const { fields } = module;
  const { sanitizedHtmlLeft, sanitizedHtmlRight } = customData;

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
      className={`section ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <BrandTwoTextColumnsContent
        sanitizedHtmlLeft={sanitizedHtmlLeft}
        sanitizedHtmlRight={sanitizedHtmlRight}
        fields={fields}
      />
    </section>
  );
};
BrandTwoTextColumns.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtmlLeft = item.fields.textLeft
    ? cleanHtml(item.fields.textLeft)
    : null;
  const sanitizedHtmlRight = item.fields.textRight
    ? cleanHtml(item.fields.textRight)
    : null;

  return {
    sanitizedHtmlLeft,
    sanitizedHtmlRight,
  };
};

export default BrandTwoTextColumns;
