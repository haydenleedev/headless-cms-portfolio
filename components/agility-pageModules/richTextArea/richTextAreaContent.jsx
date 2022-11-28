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

  const headingTextWithType = () => {
    switch (fields.headingType) {
      case "H1":
        return (
          "<h1 class=" +
          `${fields?.headingFontSize}` +
          ">" +
          `${fields.subject}` +
          "</h1>"
        );
      case "H2":
        return (
          "<h2 class=" +
          `${fields?.headingFontSize}` +
          ">" +
          `${fields.subject}` +
          "</h2>"
        );
      case "H3":
        return (
          "<h3 class=" +
          `${fields?.headingFontSize}` +
          ">" +
          `${fields.subject}` +
          "</h3>"
        );
      case "H4":
        return (
          "<h4 class=" +
          `${fields?.headingFontSize}` +
          ">" +
          `${fields.subject}` +
          "</h4>"
        );
      default:
        return (
          "<h2 class=" +
          `${fields?.headingFontSize}` +
          ">" +
          `${fields.subject}` +
          "</h2>"
        );
    }
  };

  return (
    <div
      className={`container content ${containerWidthClass} ${contentHorizontalAlignmentClass}`}
    >
      {fields.subject && (
        <div dangerouslySetInnerHTML={renderHTML(headingTextWithType())}></div>
      )}
      <div dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}></div>
    </div>
  );
};

export default RichTextAreaContent;
