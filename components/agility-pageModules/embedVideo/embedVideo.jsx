import style from "./embedVideo.module.scss";
import Heading from "../heading";
import { boolean } from "../../../utils/validation";
import {
  sanitizeHtmlConfig,
  youtubeVideoLinkToEmbed,
} from "../../../utils/convert";
import { renderHTML } from "@agility/nextjs";

const EmbedVideo = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields.narrowContainer);
  return (
    <section
      className={`section ${style.embedVideo} ${
        fields.classes ? fields.classes : ""
      }`}
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
              src={youtubeVideoLinkToEmbed(fields.videoURL.href)}
              frameBorder="0"
              allow="fullscreen;"
            />
          </div>
        </div>
      </div>
    </section>
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
