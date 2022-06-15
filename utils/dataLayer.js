export const thirtySecondTimerEvent = (data) => {
  gtag("event", "Timer", {
    event_category: "Engaged User",
    event_label: "30 Seconds",
  });
};

export const sixtySecondTimerEvent = (data) => {
  gtag("event", "Timer", {
    event_category: "Engaged User",
    event_label: "60 Seconds",
  });
};

export const customerStoryTimerEvent = (data) => {
  // window.dataLayer?.push({
  //   event: "customerStoryTimer",
  //   ...data,
  // });
};

export const phoneNumberClickEvent = (data) => {
  gtag("event", `Phone Link Click - ${data.linkText}`, {
    event_category: "Click",
    event_label: window.location.href,
  });
};

export const internalLinkClickEvent = (data) => {
  gtag("event", `Internal Link Click - ${data.linkText}`, {
    event_category: "Click",
    event_label: window.location.href,
  });
};

export const elementClickEvent = (data) => {
  gtag("event", `Element Click - ${data.elementClasses}`, {
    event_category: "Click",
    event_label: window.location.href,
  });
};

export const linkClickEvent = (data) => {
  gtag("event", `Link Click - ${data.linkText}`, {
    event_category: "Click",
    event_label: window.location.href,
  });
};

export const pathChangeEvent = (data) => {
  // window.dataLayer?.push({
  //   event: "pathChange",
  //   ...data,
  // });
};

export const siteSectionTimerEvent = (data) => {
  gtag("event", "Site Section Timer", {
    event_category: "Engaged User",
    event_label: data.siteSection,
  });
};

export const scrollDepthEvent = (data) => {
  gtag("event", window.location.href, {
    event_category: "Scroll Depth",
    event_label: `${data.scrollDepth}%`,
  });
};

export const youTubeActivityEvent = (data) => {
  gtag("event", data.action, {
    event_category: "YouTube Video",
    event_label: window.location.href,
  });
};

export const marketoScriptReadyEvent = (data) => {
  // window.dataLayer?.push({
  //   event: "marketoScriptReady",
  // });
};

export const addDataLayerEventTriggers = (router) => {
  if (typeof window !== "undefined") {
    // Regular timer triggers
    setTimeout(() => {
      thirtySecondTimerEvent({});
    }, 30000);
    setTimeout(() => {
      sixtySecondTimerEvent({});
    }, 60000);
    // Router triggers
    let previousPath = router.asPath;
    let siteSectionTimeout;
    router.events.on("routeChangeComplete", (url) => {
      const setSiteSectionTimeout = () => {
        siteSectionTimeout = setTimeout(() => {
          siteSectionTimerEvent({ siteSection: getSiteSection(url) });
        }, 30000);
      };
      const getSiteSection = (path) => {
        if (path == "/") {
          return path;
        } else {
          return (
            "/" +
            path
              .split(/(\/)/g)
              .filter(function (e) {
                return e;
              })[1]
              ?.split("?")[0]
          );
        }
      };
      pathChangeEvent({ previousPath: previousPath });
      if (previousPath !== url) {
        if (getSiteSection(previousPath) !== getSiteSection(url)) {
          clearTimeout(siteSectionTimeout);
          setSiteSectionTimeout(url);
        }
      } else if (!siteSectionTimeout) {
        // Timer for first visited page
        setSiteSectionTimeout(url);
      }
      previousPath = url;
    });
  }
};
