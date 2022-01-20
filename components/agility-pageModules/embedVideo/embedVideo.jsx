import style from "./embedVideo.module.scss";
import Heading from "../heading";
import { boolean } from "../../../utils/validation";
import {
  sanitizeHtmlConfig,
  youtubeVideoLinkToEmbed,
  vimeoLinkToEmbed
} from "../../../utils/convert";
import { renderHTML } from "@agility/nextjs";

const EmbedVideo = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields.narrowContainer);
  let videoSrc;
  if (fields.videoURL.href.includes("youtube.com")) {
    videoSrc = youtubeVideoLinkToEmbed(fields.videoURL.href);
  }
  else if (fields.videoURL.href.includes("vimeo.com")) {
    videoSrc = vimeoLinkToEmbed(fields.videoURL.href);
  }
  return (
    <>
      {videoSrc && (
        <section
          className={`section ${style.embedVideo} ${fields.classes ? fields.classes : ""
            }`}
          id={fields.id ? fields.id : null}
        >
          <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
            <div className={style.content}>
              {heading && (
                <div className={style.heading}>
                  <Heading {...heading} />
                </div>
              )}
              {fields.text && (
                <div
                  style={style.text}
                  dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                ></div>
              )}
              <div className={style.embed}>
                <iframe
                  type="text/html"
                  src={videoSrc}
                  frameBorder="0"
                  allow="fullscreen;"
                />
              </div>
            </div>
          </div>
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
