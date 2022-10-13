import Script from "next/script";

const LoadGoogleOptimize = () => {
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  return (
    <Script
      id="google-optimize"
      src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
      strategy="lazyOnload"
    />
  );
};

export default LoadGoogleOptimize;
