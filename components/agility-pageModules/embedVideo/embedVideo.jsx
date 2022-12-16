import style from "./embedVideo.module.scss";
import dynamic from "next/dynamic";
import {
  sanitizeHtmlConfig,
  youTubeVideoLinkToEmbed,
  vimeoLinkToEmbed,
} from "../../../utils/convert";
const EmbedVideoContent = dynamic(() => import("./embedVideoContent"));

const EmbedVideo = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  let videoSrc;
  let isYouTubeVideo = false;
  if (fields.videoURL.href.includes("youtube.com")) {
    videoSrc = youTubeVideoLinkToEmbed(fields.videoURL.href);
    isYouTubeVideo = true;
  } else if (fields.videoURL.href.includes("vimeo.com")) {
    videoSrc = vimeoLinkToEmbed(fields.videoURL.href);
  }

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <>
      {videoSrc && (
        <section
          className={`section ${style.embedVideo}
          ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
            fields.classes ? fields.classes : ""
          } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
          id={fields.id ? fields.id : null}
        >
          <EmbedVideoContent
            fields={fields}
            sanitizedHtml={sanitizedHtml}
            videoSrc={videoSrc}
            isYouTubeVideo={isYouTubeVideo}
          />
        </section>
      )}
    </>
  );
};

EmbedVideo.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default EmbedVideo;
