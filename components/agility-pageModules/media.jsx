import { AgilityImage } from "@agility/nextjs";
import { useEffect, useState } from "react";
import { video } from "../../schema";
import { cn } from "../../utils/generic";
import Video from "../video/video";
import OverrideSEO from "./overrideSEO/overrideSEO";

const Media = ({
  media,
  title,
  width,
  height,
  sizes,
  imageOptions,
  videoStructuredData,
}) => {
  const [videoDefinitelyNotSupported, setVideoDefinitelyNotSupported] =
    useState(false);
  let mediaName = media?.url?.split("/");
  mediaName = mediaName ? mediaName[mediaName.length - 1] : null;
  const imageFileRegex = /.*\.(jpe?g|png|svg|gif)$/;
  const mediaType = mediaName?.split(".")[1];

  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      mediaName &&
      !imageFileRegex.test(mediaName)
    ) {
      const supportTestVideo = document.createElement("video");
      if (supportTestVideo.canPlayType(`video/${mediaType}`) === "") {
        setVideoDefinitelyNotSupported(true);
      }
    }
  }, []);
  if (!media?.url) return null;
  else {
    switch (imageFileRegex.test(mediaName)) {
      case true:
        return (
          <AgilityImage
            src={media.url}
            alt={media.label || ""}
            width={width || 122}
            height={height || 75}
            sizes={
              sizes ||
              "(max-width: 480px) 360px, (max-width: 640px) 480px, 50vw"
            }
            title={title ? title : ""}
            {...imageOptions}
            className={cn({
              "agility-image": true,
              [imageOptions?.className]:
                typeof imageOptions === "object" &&
                imageOptions?.hasOwnProperty?.("className"),
            })}
          />
        );
      default:
        return (
          <>
            {videoStructuredData && (
              <OverrideSEO
                module={{ fields: {} }}
                additionalSchemas={[
                  video({ ...videoStructuredData, contentUrl: media.url }),
                ]}
              />
            )}
            {videoDefinitelyNotSupported ? (
              <div className="unsupported-video">
                <div>
                  <p>Your browser does not support the format of this video.</p>
                </div>
              </div>
            ) : (
              <Video
                src={media.url}
                type={`video/${mediaType}`}
                className="video"
                autoPlay
                playsInline
                muted
                loop
                controls
                ariaLabel={media.label || ""}
              />
            )}
          </>
        );
    }
  }
};

export default Media;
