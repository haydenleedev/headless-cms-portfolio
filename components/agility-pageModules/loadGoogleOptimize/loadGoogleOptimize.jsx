import Script from "next/script";
import { useContext } from "react";
import GlobalContext from "../../../context";

const LoadGoogleOptimize = () => {
  const { canLoadOptimize } = useContext(GlobalContext);
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";

  // wait for onetrust to load before injecting the script.
  return canLoadOptimize ? (
    <Script
      id="google-optimize"
      src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
      strategy="lazyOnload"
    />
  ) : null;
};

export default LoadGoogleOptimize;
