import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));
import style from "./modal.module.scss";
import Media from "../media";

import AgilityLink from "../../agilityLink";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";

const Modal = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <>
      <div className={style.backdrop}>
        <span className={style.visuallyhidden} id="close-btn">
          Close Popup
        </span>
      </div>

      <div
        className={`${style.modal} ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${style.narrow}`}
      >
        <button
          type="button"
          className={style.close}
          id="close-btn"
          tabIndex="-1"
        >
          <span className={style.visuallyHidden}>Close Popup</span>
        </button>
        <div className={style.modalWrapper}>
          <AgilityLink
            agilityLink={fields.link}
            className={`${style.linkBlock}`}
            ariaLabel={`Navigate to page ` + fields.link.href}
            title={`Navigate to page ` + fields.link.href}
          >
            <span className={style.visuallyHidden}>{fields.link.text}</span>
          </AgilityLink>
          {fields.backgroundImage && (
            <div className={style.backgroundImage}>
              <Media media={fields.backgroundImage} />
            </div>
          )}
          <div className={style.contentWrapper}>
            {heading.text && (
              <div className={style.heading}>
                <Heading {...heading} />
              </div>
            )}
            {fields.textContent && (
              <div
                className={style.content}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              ></div>
            )}
            {fields.link && (
              <span className={`button orange outlined ${style.ctaText}`}>
                {fields.link.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Modal.getCustomInitialProps = async function ({ item }) {
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

export default Modal;
