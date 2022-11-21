import { renderHTML } from "@agility/nextjs";
import { useEffect } from "react";
import style from "./richTextArea.module.scss";

const RichTextAreaContent = ({ fields, sanitizedHtml }) => {
  const contentHorizontalAlignmentClass = fields.contentHorizontalAlignment
    ? `align-${fields.contentHorizontalAlignment}`
    : "";
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
    <div
      className={`container content ${containerWidthClass} ${contentHorizontalAlignmentClass}`}
    >
      {fields.subject && (
        <h2 className={fields?.headingFontSize}>{fields.subject}</h2>
      )}
      <div dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}></div>
    </div>
  );
};

export default RichTextAreaContent;
