import Script from "next/script";
import { useState, useEffect } from "react";
import {
  marketoFormSuccess,
  marketoScriptReady,
  thirtySecondTimer,
} from "./triggers";
import htmlMarketoFormListener from "./scripts/htmlMarketoFormListener";
import g2Crowd from "./scripts/g2Crowd";
import marketoAsynchMunchkin from "./scripts/marketoAsynchMunchkin";

export const Tags = () => {
  return (
    <>
      <ScriptTag
        script={htmlMarketoFormListener}
        scriptId="htmlMarketoFormListener"
        triggerInitializer={marketoScriptReady}
      />
      <ScriptTag script={g2Crowd} scriptId="g2Crowd" />
      <ScriptTag
        script={marketoAsynchMunchkin}
        scriptId="marketoAsyncMunchkin"
      />
      {/* LinkedIn Conversion */}
      <PixelTag
        src={
          "https://px.ads.linkedin.com/collect/?pid=1316394&conversionId=1966345&fmt=gif"
        }
        triggerInitializer={marketoFormSuccess}
      />
    </>
  );
};

const ScriptTag = ({
  script,
  scriptId,
  scriptStrategy,
  triggerInitializer,
}) => {
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

const PixelTag = ({ src, triggerInitializer }) => {
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

  useEffect(() => {
    if (triggered) {
      const pixel = new Image();
      pixel.src = src;
    }
  }, [triggered]);
  return null;
};
