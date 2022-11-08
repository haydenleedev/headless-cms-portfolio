import style from "./embedVideo.module.scss";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
import { boolean } from "../../../utils/validation";
import {
  sanitizeHtmlConfig,
  youTubeVideoLinkToEmbed,
  vimeoLinkToEmbed,
} from "../../../utils/convert";
import { renderHTML } from "@agility/nextjs";
import Script from "next/script";
import { useEffect } from "react";
import { youTubeActivityEvent } from "../../../utils/dataLayer";

const EmbedVideo = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields.narrowContainer);
  const layout = fields.layout;
  const disableBorder = boolean(fields.disableBorder);
  let videoSrc;
  let isYouTubeVideo = false;
  if (fields.videoURL.href.includes("youtube.com")) {
    videoSrc = youTubeVideoLinkToEmbed(fields.videoURL.href);
    isYouTubeVideo = true;
  } else if (fields.videoURL.href.includes("vimeo.com")) {
    videoSrc = vimeoLinkToEmbed(fields.videoURL.href);
  }

  useEffect(() => {
    // Add player listeners if the YouTube API script was already loaded
    if (window.YT?.Player) {
      handleAPIScriptLoad(true);
    }
  }, []);

  const handleAPIScriptLoad = (manuallyCallAPIReady) => {
    let player;
    if (manuallyCallAPIReady == true) {
      onYouTubeIframeAPIReady();
    }
    function onYouTubeIframeAPIReady() {
      const playbackPercentages = [
        {
          percentage: 10,
          played: false,
        },
        {
          percentage: 25,
          played: false,
        },
        {
          percentage: 50,
          played: false,
        },
        {
          percentage: 75,
          played: false,
        },
        {
          percentage: 90,
          played: false,
        },
      ];
      let playerStateSequence = [];
      let timer = null;
      let previousVideoTime = null;
      player = new window.YT.Player("video-player");
      player.addEventListener("onStateChange", (e) => {
        const playerState = e.data;
        playerStateSequence = [...playerStateSequence, playerState];
        if (
          arraysAreEqual(playerStateSequence, [2, 3, 1]) ||
          arraysAreEqual(playerStateSequence, [3, 1])
        ) {
          youTubeActivityEvent({ action: "Seek" });
          playerStateSequence = [];
        } else if (
          arraysAreEqual(playerStateSequence, [-1, 3, 1]) ||
          arraysAreEqual(playerStateSequence, [1, 3, 1])
        ) {
          youTubeActivityEvent({ action: "Video start" });
          playerStateSequence = [];
        } else {
          clearTimeout(timer);
          if (playerState !== 3) {
            let timeout = setTimeout(() => {
              if (playerState == 0) {
                youTubeActivityEvent({ action: "Video end" });
              } else if (playerState == 1) {
                youTubeActivityEvent({ action: "Play" });
              } else if (playerState == 2) {
                youTubeActivityEvent({ action: "Pause" });
              }
              playerStateSequence = [];
            }, 250);
            timer = timeout;
          }
        }
      });
      player.addEventListener("onReady", () => {
        setInterval(() => {
          const timeChangeSeconds = Math.round(
            player.getCurrentTime() - previousVideoTime
          );
          let playbackPercentage =
            (player.getCurrentTime() / player.getDuration()) * 100;
          if (timeChangeSeconds > 0 && timeChangeSeconds <= 1) {
            for (let i = 0; i < playbackPercentages.length; i++) {
              if (
                playbackPercentage >= playbackPercentages[i].percentage &&
                !playbackPercentages[i].played
              ) {
                if (
                  Math.round(
                    (playbackPercentages[i].percentage / 100) *
                      player.getDuration() -
                      previousVideoTime
                  ) == 0
                ) {
                  youTubeActivityEvent({
                    action: `Playback percentage: ${playbackPercentages[i].percentage}`,
                  });
                  playbackPercentages[i].played = true;
                }
              }
            }
          }
          previousVideoTime = player.getCurrentTime();
        }, 1000);
      });
      const arraysAreEqual = (firstArr, secondArr) => {
        return firstArr.toString() == secondArr.toString();
      };
    }
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  };

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
          <div
            className={`container ${narrowContainer ? "max-width-narrow" : ""}`}
          >
            <div className={`${style.content} ${layout ? style[layout] : ""}`}>
              <div className={style.text}>
                {heading && (
                  <div className={style.heading}>
                    <Heading {...heading} />
                  </div>
                )}
                {fields.text && (
                  <div
                    className={style.text}
                    dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                  ></div>
                )}
              </div>
              <div
                className={`${style.embed} ${
                  disableBorder ? style.disableBorder : ""
                }`}
              >
                <div className={style.iframeWrapper}>
                  <iframe
                    id="video-player"
                    type="text/html"
                    src={videoSrc}
                    frameBorder="0"
                    allow="fullscreen;"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {isYouTubeVideo && (
        <Script
          src="https://www.youtube.com/iframe_api"
          onLoad={handleAPIScriptLoad}
        />
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
