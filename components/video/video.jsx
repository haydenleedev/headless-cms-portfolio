import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../../utils/hooks";
import style from "./video.module.scss";
const Video = ({
  src,
  type,
  className,
  autoPlay,
  playsInline,
  muted,
  loop,
  controls,
  ariaLabel,
}) => {
  const loaded = useRef(false);
  const videoRef = useIntersectionObserver(
    {
      threshold: 0.0,
    },
    0.0,
    async () => {
      if (videoRef.current !== null && !loaded.current) {
        const res = await fetch(src);
        const data = await res.blob();
        if (videoRef.current) videoRef.current.src = URL.createObjectURL(data);
        loaded.current = true;
      }
    }
  );
  return (
    <div className={style.videoWrapper}>
      <video
        ref={videoRef}
        className={`${className}`}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        controls={controls}
        aria-label={ariaLabel}
        preload={"none"}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
