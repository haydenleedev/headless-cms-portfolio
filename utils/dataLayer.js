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

export const addDataLayerEventTriggers = (router) => {
  if (typeof window !== "undefined") {
    // Regular timer triggers
    setInterval(() => {
      thirtySecondTimerEvent({});
    }, 30000);
    setInterval(() => {
      sixtySecondTimerEvent({});
    }, 60000);
    // Router triggers
    let previousPath = router.asPath;
    let siteSectionInterval;
    router.events.on("routeChangeComplete", (url) => {
      const setSiteSectionInterval = () => {
        siteSectionInterval = setInterval(() => {
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
          clearInterval(siteSectionInterval);
          setSiteSectionInterval(url);
        }
      }
      else if (!siteSectionInterval) {
        // Interval based on first visited page
        setSiteSectionInterval(url);
      }
      previousPath = url;
      if (url.includes("thank-you")) {
        formSuccessEvent({});
      } 
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
