import Script from "next/script";
import { useState, useEffect } from "react";
import { marketoScriptReady } from "./triggers";
import htmlMarketoFormListener from "./scripts/htmlMarketoFormListener";
import ax from "./scripts/ax";
import g2Crowd from "./scripts/g2Crowd";
import marketoAsynchMunchkin from "./scripts/marketoAsynchMunchkin";

export const Tags = () => {
  return (
    <>
      <Tag
        script={htmlMarketoFormListener}
        scriptId="htmlMarketoFormListener"
        triggerInitializer={marketoScriptReady}
      />
      <Tag script={ax} scriptId="ax" />
      <Tag script={g2Crowd} scriptId="g2Crowd" />
      <Tag script={marketoAsynchMunchkin} scriptId="marketoAsyncMunchkin" />
    </>
  );
};

const Tag = ({ script, scriptId, scriptStrategy, triggerInitializer }) => {
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    if (triggerInitializer) {
      triggerInitializer(setTriggered);
    } else {
      setTimeout(() => {
        setTriggered(true);
      }, 0);
    }
  }, []);
  return triggered ? (
    <Script id={scriptId} strategy={scriptStrategy || "afterInteractive"}>
      {script}
    </Script>
  ) : null;
};
