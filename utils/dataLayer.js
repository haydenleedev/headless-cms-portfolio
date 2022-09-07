export const thirtySecondTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "thirtySecondTimer",
    ...data,
  });
  // gtag("event", "Timer", {
  //   event_category: "Engaged User",
  //   event_label: "30 Seconds",
  // });
};

export const engagedUserTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "sixtySecondTimer",
    ...data,
  });
  // gtag("event", "Timer", {
  //   event_category: "Engaged User",
  //   event_label: `${data.seconds} Seconds`,
  // });
};

export const customerStoryTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "customerStoryTimer",
    ...data,
  });
  // window.dataLayer?.push({
  //   event: "customerStoryTimer",
  //   ...data,
  // });
};

export const phoneNumberClickEvent = (data) => {
  window.dataLayer?.push({
    event: "phoneNumberClick",
    ...data,
  });
  // gtag("event", `Phone Link Click - ${data.linkText}`, {
  //   event_category: "Click",
  //   event_label: window.location.href,
  // });
};

export const internalLinkClickEvent = (data) => {
  window.dataLayer?.push({
    event: "internalLinkClick",
    ...data,
  });
  // gtag("event", `Internal Link Click - ${data.linkText}`, {
  //   event_category: "Click",
  //   event_label: window.location.href,
  // });
};

export const elementClickEvent = (data) => {
  window.dataLayer?.push({
    event: "elementClick",
    ...data,
  });
  // gtag("event", `Element Click - ${data.elementClasses}`, {
  //   event_category: "Click",
  //   event_label: window.location.href,
  // });
};

export const linkClickEvent = (data) => {
  window.dataLayer?.push({
    event: "linkClick",
    ...data,
  });
  // gtag("event", `Link Click - ${data.linkText}`, {
  //   event_category: "Click",
  //   event_label: window.location.href,
  // });
};

export const pathChangeEvent = (data) => {
  window.dataLayer?.push({
    event: "pathChange",
    ...data,
  });
  // window.dataLayer?.push({
  //   event: "pathChange",
  //   ...data,
  // });
};

export const engagedUserSiteSectionTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "siteSectionTimer",
    ...data,
  });
  // gtag("event", "Site Section Timer", {
  //   event_category: "Engaged User",
  //   event_label: data.siteSection,
  // });
};

export const scrollDepthEvent = (data) => {
  window.dataLayer?.push({
    event: "scrollDepth",
    scrollBreakpoint: data.scrollDepth,
  });
  // gtag("event", window.location.href, {
  //   event_category: "Scroll Depth",
  //   event_label: `${data.scrollDepth}%`,
  // });
};

export const youTubeActivityEvent = (data) => {
  window.dataLayer?.push({
    event: "youTubeActivity",
    youTubeAction: data.action,
  });
  // gtag("event", data.action, {
  //   event_category: "YouTube Video",
  //   event_label: window.location.href,
  // });
};

export const marketoScriptReadyEvent = (data) => {
  // window.dataLayer?.push({
  //   event: "marketoScriptReady",
  // });
};

export const marketoFormInViewEvent = (data) => {
  // gtag("event", "Form Visible", {
  //   event_category: "Marketo Form",
  //   event_label: window.location.href,
  // });
};

export const marketoFormSubmissionEvent = (data) => {
  // gtag("event", "Form Submission", {
  //   event_category: "Marketo Form",
  //   event_label: window.location.href,
  // });
};

export const verticalPageViewEvent = (data) => {
  gtag("event", "Vertical Page View", {
    event_category: "Page View",
    event_label: window.location.href,
  });
};

// export const addDataLayerEventTriggers = (router) => {
//   if (typeof window !== "undefined") {
//     // Router triggers
//     let previousPath = router.asPath;
//     let siteSectionTimeout;
//     router.events.on("routeChangeComplete", (url) => {
//       const setSiteSectionTimeout = () => {
//         siteSectionTimeout = setTimeout(() => {
//           engagedUserSiteSectionTimerEvent({
//             siteSection: getSiteSection(url),
//           });
//         }, 30000);
//       };
//       const getSiteSection = (path) => {
//         if (path == "/") {
//           return path;
//         } else {
//           return (
//             "/" +
//             path
//               .split(/(\/)/g)
//               .filter(function (e) {
//                 return e;
//               })[1]
//               ?.split("?")[0]
//           );
//         }
//       };
//       pathChangeEvent({ previousPath: previousPath });
//       if (previousPath !== url) {
//         if (getSiteSection(previousPath) !== getSiteSection(url)) {
//           clearTimeout(siteSectionTimeout);
//           setSiteSectionTimeout(url);
//         }
//       } else if (!siteSectionTimeout) {
//         // Timer for first visited page
//         setSiteSectionTimeout(url);
//       }
//       previousPath = url;
//     });
//   }
// };

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
      engagedUserTimerEvent({});
    }, 60000);
    // Router triggers
    let previousPath = router.asPath;
    let siteSectionTimeout;
    router.events.on("routeChangeComplete", (url) => {
      const setSiteSectionTimeout = () => {
        siteSectionTimeout = setTimeout(() => {
          engagedUserSiteSectionTimerEvent({
            siteSection: getSiteSection(url),
          });
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
    // Click triggers
    window.addEventListener("click", (e) => {
      if (e.target.nodeName === "A") {
        linkClickEvent({});
        if (e.target.href.includes("tel:")) {
          phoneNumberClickEvent({});
        } else if (e.target.href.includes(process.env.NEXT_PUBLIC_SITE_URL)) {
          internalLinkClickEvent({});
        }
      } else if (e.target.parentNode.nodeName === "A") {
        linkClickEvent({});
        if (
          e.target.parentNode.href.includes(process.env.NEXT_PUBLIC_SITE_URL)
        ) {
          internalLinkClickEvent({});
        }
      } else {
        elementClickEvent({});
      }
    });
  }
};
