import { renderHTML } from "@agility/nextjs";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect } from "react";
import { youTubeActivityEvent } from "../../../utils/dataLayer";
import { boolean } from "../../../utils/validation";
const Heading = dynamic(() => import("../heading"), { ssr: false });
import style from "./embedVideo.module.scss";

const EmbedVideoContent = ({
  fields,
  sanitizedHtml,
  videoSrc,
  isYouTubeVideo,
}) => {
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields.narrowContainer);
  const layout = fields.layout;
  const disableBorder = boolean(fields.disableBorder);

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

  return (
    <>
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
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
      {isYouTubeVideo && (
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="worker"
          onLoad={handleAPIScriptLoad}
        />
      )}
    </>
  );
};

export default EmbedVideoContent;
