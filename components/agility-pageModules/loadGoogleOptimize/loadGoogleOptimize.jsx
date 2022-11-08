import Script from "next/script";
import { useEffect, useState } from "react";

const LoadGoogleOptimize = () => {
  const [timerExpired, setTimerExpired] = useState(false);
  useEffect(() => {
    // Delay script loading with setTimeout
    setTimeout(() => {
      setTimerExpired(true);
    }, 0);
  }, []);
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  return timerExpired ? (
    <Script
      id="google-optimize"
      src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
      strategy="lazyOnload"
    />
  ) : null;
};

export default LoadGoogleOptimize;
