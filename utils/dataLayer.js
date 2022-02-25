export const formSubmissionEvent = (data) => {
  window.dataLayer?.push({
    event: "formSubmission",
    formCategory: "Marketo Form",
    formAction: "Form Submission",
    ...data,
  });
};

export const formSuccessEvent = (data) => {
  window.dataLayer?.push({
    event: "formSuccess",
    ...data,
  });
};

export const thirtySecondTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "thirtySecondTimer",
    ...data,
  });
};

export const sixtySecondTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "sixtySecondTimer",
    ...data,
  });
};

export const customerStoryTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "customerStoryTimer",
    ...data,
  });
};

export const phoneNumberClickEvent = (data) => {
  window.dataLayer?.push({
    event: "phoneNumberClick",
    ...data,
  });
};

export const internalLinkClickEvent = (data) => {
  window.dataLayer?.push({
    event: "internalLinkClick",
    ...data,
  });
};

export const elementClickEvent = (data) => {
  window.dataLayer?.push({
    event: "elementClick",
    ...data,
  });
};

export const linkClickEvent = (data) => {
  window.dataLayer?.push({
    event: "linkClick",
    ...data,
  });
};

export const pathChangeEvent = (data) => {
  window.dataLayer?.push({
    event: "pathChange",
    ...data,
  });
}

export const siteSectionTimerEvent = (data) => {
  window.dataLayer?.push({
    event: "siteSectionTimer",
    ...data,
  });
}

export const scrollDepthEvent = (data) => {
  window.dataLayer?.push({
    event: "scrollDepth",
    ...data,
  });
}

export const addDataLayerEventTriggers = (router) => {
  if (typeof window !== "undefined") {
    // Scroll triggers
    const scrollBreakpoints = [
      {
        threshold: 25,
        triggered: false
      },
      {
        threshold: 50,
        triggered: false
      },
      {
        threshold: 75,
        triggered: false
      },
      {
        // 98 is used here as mobile browsers sometimes have trouble reaching 99-100
        threshold: 98,
        reportValue: 100,
        triggered: false
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
    }
    window.addEventListener("scroll", () => {
      if (!scrolling && !scrollBreakpoints[scrollBreakpoints.length - 1].triggered) {
        scrolling = true;
        setTimeout(() => {
          let scrollPercentage = document.scrollingElement.scrollTop / (document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight) * 100;
          scrolling = false;
          for (let i = 0; i < scrollBreakpoints.length; i++) {
            if (i < scrollBreakpoints.length - 1) {
              if (scrollPercentage >= scrollBreakpoints[i].threshold && scrollPercentage < scrollBreakpoints[i + 1].threshold && !scrollBreakpoints[i].triggered) {
                scrollBreakpoints[i].triggered = true;
                if (i > 0) {
                  triggerPreviousScrollBreakpoints(i);
                }
                scrollDepthEvent({ scrollDepth: scrollBreakpoints[i].threshold });
              }
            }
            else if (scrollPercentage >= scrollBreakpoints[i].threshold && !scrollBreakpoints[i].triggered) {
              scrollBreakpoints[i].triggered = true;
              triggerPreviousScrollBreakpoints(i);
              scrollDepthEvent({ scrollDepth: scrollBreakpoints[i].reportValue });
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
      }
      const getSiteSection = (path) => {
        if (path == "/") {
          return path;
        }
        else {
          return "/" + path.split(/(\/)/g).filter(function(e) { return e; })[1]?.split("?")[0];
        }
      }
      pathChangeEvent({ previousPath: previousPath, newPath: url });
      if (previousPath !== url) {
        if (getSiteSection(previousPath) !== getSiteSection(url)) {
          clearTimeout(siteSectionTimeout);
          setSiteSectionTimeout(url);
        }
      }
      else if (!siteSectionTimeout) {
        // Timer for first visited page
        setSiteSectionTimeout(url);
      }
      previousPath = url;
      if (url.includes("thank-you")) {
        formSuccessEvent({});
      }
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
        }
        else if (e.target.href.includes(process.env.NEXT_PUBLIC_SITE_URL)) {
          internalLinkClickEvent({});
        }
      }
      else {
        elementClickEvent({});
      }
    });
  }
}
