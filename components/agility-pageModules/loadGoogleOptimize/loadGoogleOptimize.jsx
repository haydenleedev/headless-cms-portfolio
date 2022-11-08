import Script from "next/script";
import { useEffect, useState } from "react";

const LoadGoogleOptimize = () => {
  const [userInteracted, setUserInteracted] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  useEffect(() => {
    const userInteractionEvent = () => {
      setUserInteracted(true);
      window.removeEventListener("scroll", userInteractionEvent);
      window.removeEventListener("mousedown", userInteractionEvent);
      window.removeEventListener("touchstart", userInteractionEvent);
      window.removeEventListener("keydown", userInteractionEvent);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", userInteractionEvent);
      window.addEventListener("mousedown", userInteractionEvent);
      window.addEventListener("touchstart", userInteractionEvent);
      window.addEventListener("keydown", userInteractionEvent);
    }
    // Delay script loading with setTimeout
    setTimeout(() => {
      setTimerExpired(true);
    }, 0);
    return () => {
      window.removeEventListener("scroll", userInteractionEvent);
      window.removeEventListener("mousedown", userInteractionEvent);
      window.removeEventListener("touchstart", userInteractionEvent);
      window.removeEventListener("keydown", userInteractionEvent);
    };
  }, []);
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  return userInteracted && timerExpired ? (
    <Script
      id="google-optimize"
      src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
      strategy="lazyOnload"
    />
  ) : null;
};

export default LoadGoogleOptimize;
