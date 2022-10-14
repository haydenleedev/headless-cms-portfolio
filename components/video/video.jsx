import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../../utils/hooks";

const video = ({
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
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      playsInline={playsInline}
      muted={muted}
      loop={loop}
      controls={controls}
      aria-label={ariaLabel}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default video;
