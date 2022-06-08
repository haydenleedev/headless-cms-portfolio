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
    // Scroll triggers
    const scrollBreakpoints = [
      {
        threshold: 25,
        triggered: false,
      },
      {
        threshold: 50,
        triggered: false,
      },
      {
        threshold: 75,
        triggered: false,
      },
      {
        // 98 is used here as mobile browsers sometimes have trouble reaching 99-100
        threshold: 98,
        reportValue: 100,
        triggered: false,
      },
    ];
    let scrolling = false;
    const triggerPreviousScrollBreakpoints = (currentIndex) => {
      for (let i = 0; i < currentIndex; i++) {
        if (!scrollBreakpoints[i].triggered) {
          scrollBreakpoints[i].triggered = true;
          scrollDepthEvent({ scrollDepth: scrollBreakpoints[i].threshold });
        }
      }
    };
    window.addEventListener("scroll", () => {
      if (
        !scrolling &&
        !scrollBreakpoints[scrollBreakpoints.length - 1].triggered
      ) {
        scrolling = true;
        setTimeout(() => {
          let scrollPercentage =
            (document.scrollingElement.scrollTop /
              (document.scrollingElement.scrollHeight -
                document.scrollingElement.clientHeight)) *
            100;
          scrolling = false;
          for (let i = 0; i < scrollBreakpoints.length; i++) {
            if (i < scrollBreakpoints.length - 1) {
              if (
                scrollPercentage >= scrollBreakpoints[i].threshold &&
                scrollPercentage < scrollBreakpoints[i + 1].threshold &&
                !scrollBreakpoints[i].triggered
              ) {
                scrollBreakpoints[i].triggered = true;
                if (i > 0) {
                  triggerPreviousScrollBreakpoints(i);
                }
                scrollDepthEvent({
                  scrollDepth: scrollBreakpoints[i].threshold,
                });
              }
            } else if (
              scrollPercentage >= scrollBreakpoints[i].threshold &&
              !scrollBreakpoints[i].triggered
            ) {
              scrollBreakpoints[i].triggered = true;
              triggerPreviousScrollBreakpoints(i);
              scrollDepthEvent({
                scrollDepth: scrollBreakpoints[i].reportValue,
              });
            }
          }
        }, 500);
      }
    });
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
      // Reset scroll triggers
      scrollBreakpoints.forEach((breakpoint) => {
        breakpoint.triggered = false;
      });
    });
  }
};
