import style from "./videoPopup.module.scss";
import dynamic from "next/dynamic";
import { renderHTML } from "@agility/nextjs";
import { useState } from "react";
const Heading = dynamic(() => import("../heading"));
const Media = dynamic(() => import("../media"));

const VideoPopupContent = ({ fields, sanitizedHtml }) => {
  const hasVideoStructuredDataFields =
    fields.videoName &&
    fields.videoDescription &&
    fields.videoThumbnail &&
    fields.videoUploadDate;

  const narrowContainer = fields.containerWidth == "narrow";
  const wideContainer = fields.containerWidth == "wide";
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const [modalActive, setModalActive] = useState(false);
  let mediaName = fields.video?.url?.split("/");
  mediaName = mediaName ? mediaName[mediaName.length - 1] : null;
  const mediaType = mediaName?.split(".")[1];
  return (
    <div
      className={`container ${style.content} ${
        narrowContainer ? "max-width-narrow" : ""
      }  ${wideContainer ? "max-width-brand" : ""}`}
    >
      {heading && (
        <div className={style.heading}>
          <Heading {...heading} />
        </div>
      )}
      {fields.text && (
        <div
          className="align-center"
          dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
        ></div>
      )}
      <div className={style.autoplayVideoWrapper}>
        <video className="video display-block" autoPlay muted loop playsInline>
          <source src={fields.video.url} type={`video/${mediaType}`} />
        </video>
        <div className={style.playButtonOverlay}>
          <div
            className={style.playButtonWrapper}
            role="button"
            aria-label="Open video modal"
            tabIndex={0}
            onClick={() => {
              setModalActive(true);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter" || e.key == " ") {
                e.preventDefault();
                setModalActive(true);
              }
            }}
          >
            <div className={style.playButtonIcon}></div>
            <span>Play Video</span>
          </div>
        </div>
      </div>
      <div
        className={`${style.videoModal} ${modalActive ? style.visible : ""}`}
      >
        <div className={style.closeButtonWrapper}>
          <button
            onClick={() => {
              setModalActive(false);
            }}
            aria-label={"Close video modal"}
          >
            ✕
          </button>
        </div>
        <div className={style.modalVideoWrapper}>
          <Media
            media={fields.video}
            videoStructuredData={
              hasVideoStructuredDataFields
                ? {
                    name: fields.videoName,
                    description: fields.videoDescription,
                    thumbnailUrl: [fields.videoThumbnail.url],
                    uploadDate: new Date(fields.videoUploadDate).toISOString(),
                  }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPopupContent;
