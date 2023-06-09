import Media from "../../../components/agility-pageModules/media";
import style from "./brandVideoPopup.module.scss";
import Heading from "../../../components/agility-pageModules/heading";
import { renderHTML } from "@agility/nextjs";
import { useState } from "react";

const BrandVideoPopup = ({ module }) => {
  const { fields } = module;
  const narrowContainer = fields.containerWidth == "narrow";
  const wideContainer = fields.containerWidth == "wide";
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const [modalActive, setModalActive] = useState(false);
  let mediaName = fields.video?.url?.split("/");
  mediaName = mediaName ? mediaName[mediaName.length - 1] : null;
  const mediaType = mediaName?.split(".")[1];
  return (
    <section
      className={fields?.backgroundColor ? fields?.backgroundColor : "" || null}
    >
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
            dangerouslySetInnerHTML={renderHTML(fields.text)}
          ></div>
        )}
        <div className={style.autoplayVideoWrapper}>
          <video
            className="video display-block"
            autoPlay
            muted
            loop
            playsInline
          >
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
            <Media media={fields.video} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandVideoPopup;
