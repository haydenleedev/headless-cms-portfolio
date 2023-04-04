import Script from "next/script";
import { useState } from "react";
import { useIntersectionObserver } from "../../utils/hooks";

const LazyLoadReCAPTCHA = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const intersectionRef = useIntersectionObserver(
    {
      threshold: 0.0,
    },
    0.0,
    () => {
      if (!shouldLoad && typeof grecaptcha === "undefined") setShouldLoad(true);
    }
  );

  return (
    <>
      <span
        ref={intersectionRef}
        style={{ display: "block", height: "0", width: "0" }}
      ></span>
      {shouldLoad && (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY}`}
          strategy="lazyOnload"
        />
      )}
    </>
  );
};

export default LazyLoadReCAPTCHA;
