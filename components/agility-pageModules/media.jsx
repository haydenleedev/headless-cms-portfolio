import { AgilityImage } from "@agility/nextjs";
import { useEffect, useState } from "react";
import { video } from "../../schema";
import Video from "../video/video";
import OverrideSEO from "./overrideSEO/overrideSEO";

const Media = ({ media, title, imageOptions, videoStructuredData }) => {
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
            width={media.pixelWidth != "0" ? media.pixelWidth + "px" : "360"}
            height={media.pixelHeight}
            title={title ? title : ""}
            // Does not work well...
            // layout="responsive"
            {...imageOptions}
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
