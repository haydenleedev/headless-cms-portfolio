import style from "./embedVideo.module.scss";
import Heading from "../heading";
import { boolean } from "../../../utils/validation";
import { youtubeVideoLinkToEmbed } from "../../../utils/convert";
const EmbedVideo = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields.narrowContainer);
  return (
    <section className={`section ${style.embedVideo}`}>
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
              dangerouslySetInnerHTML={{ __html: fields.text }}
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

export default EmbedVideo;
