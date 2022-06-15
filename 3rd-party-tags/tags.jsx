import Script from "next/script";
import { Component, useState, useEffect } from "react";
import {
  elementClick,
  linkClick,
  marketoFormSuccess,
  marketoScriptReady,
  youTubeActivity,
  scrollDepth,
  sixtySecondTimer,
} from "./triggers";
import htmlMarketoFormListener from "./scripts/htmlMarketoFormListener";
import g2Crowd from "./scripts/g2Crowd";
import marketoAsynchMunchkin from "./scripts/marketoAsynchMunchkin";
import {
  elementClickEvent,
  linkClickEvent,
  youTubeActivityEvent,
  scrollDepthEvent,
  engagedUserTimerEvent,
} from "../utils/dataLayer";

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
      <AnalyticsTag
        generateEvent={elementClickEvent}
        triggerInitializer={elementClick}
      />
      <AnalyticsTag
        generateEvent={linkClickEvent}
        triggerInitializer={linkClick}
      />
      <AnalyticsTag
        generateEvent={youTubeActivityEvent}
        triggerInitializer={youTubeActivity}
      />
      <AnalyticsTag
        generateEvent={scrollDepthEvent}
        triggerInitializer={scrollDepth}
      />
      <AnalyticsTag
        generateEvent={engagedUserTimerEvent}
        triggerInitializer={sixtySecondTimer}
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
  const [eventStatus, setEventStatus] = useState({});
  useEffect(() => {
    if (triggerInitializer) {
      triggerInitializer(setEventStatus);
    } else {
      setTimeout(() => {
        setEventStatus({ triggered: true });
      }, 0);
    }
  }, []);
  return eventStatus.triggered ? (
    <Script id={scriptId} strategy={scriptStrategy || "afterInteractive"}>
      {script}
    </Script>
  ) : null;
};

const PixelTag = ({ src, triggerInitializer }) => {
  const [eventStatus, setEventStatus] = useState(false);
  useEffect(() => {
    if (triggerInitializer) {
      triggerInitializer(setEventStatus);
    } else {
      setTimeout(() => {
        setEventStatus({ triggered: true });
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (eventStatus.triggered) {
      const pixel = new Image();
      pixel.src = src;
    }
  }, [eventStatus]);
  return null;
};

class AnalyticsTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventStatus: {},
    };
  }
  updateEventStatus = (newStatus) => {
    this.setState({ eventStatus: newStatus }, () => {
      if (this.state.eventStatus.triggered) {
        this.props.generateEvent(this.state.eventStatus.details);
        this.setState({ eventStatus: {} });
      }
    });
  };
  render() {
    return null;
  }
  componentDidMount() {
    if (this.props.triggerInitializer) {
      this.props.triggerInitializer(this.updateEventStatus);
    }
  }
}
