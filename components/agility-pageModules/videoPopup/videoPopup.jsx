import style from "./videoPopup.module.scss";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import dynamic from "next/dynamic";
const VideoPopupContent = dynamic(() => import("./videoPopupContent"));

const VideoPopup = ({ module, customData }) => {
  const { fields } = module;
  const { sanitizedHtml } = customData;
  return (
    <section className={`section ${style.null}`}>
      <VideoPopupContent fields={fields} sanitizedHtml={sanitizedHtml} />
    </section>
  );
};

VideoPopup.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default VideoPopup;
