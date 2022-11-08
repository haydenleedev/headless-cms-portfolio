import { renderHTML } from "@agility/nextjs";
import { useEffect } from "react";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./richTextArea.module.scss";
import {richTextSanitizeConfig} from "./richTextSanitizeConfig";
const RichTextArea = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const contentHorizontalAlignmentClass = fields.contentHorizontalAlignment
    ? `align-${fields.contentHorizontalAlignment}`
    : "";

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  let containerWidthClass = style.content;
  if (fields.containerWidth == "narrow") {
    containerWidthClass += " max-width-narrow";
  } else if (fields.containerWidth == "fullContainerWidth") {
    containerWidthClass = style.fullContainerWidthContent;
  }

  useEffect(() => {
    const cookiePrefAnchors = document.querySelectorAll(
      "a[href*='/cookie-preferences']"
    );
    const toggleCookieBanner = (e) => {
      e.preventDefault();
      e.target.href = "#";
      window?.OneTrust?.ToggleInfoDisplay?.();
    };

    cookiePrefAnchors.forEach((anchor) => {
      anchor.addEventListener("click", toggleCookieBanner);
    });
  }, [sanitizedHtml]);

  return (
    <section
      className={`section ${
        style.richTextArea
      } ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      } ${fields.classes ? fields.classes : ""}`}
      id={fields.id ? fields.id : null}
    >
      <div
        className={`container content ${containerWidthClass} ${contentHorizontalAlignmentClass}`}
        dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
      ></div>
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
  const sanitizedHtml = sanitizeHtml(firstSanitization, richTextSanitizeConfig(item.fields.bodyTextFontSize, item.fields.headingFontSize));
  return {
    sanitizedHtml,
  };
};

export default RichTextArea;
