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
  console.log(data)
  window.dataLayer?.push({
    event: "pathChange",
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
    let customerStoryPageInterval;
    let customerStoryPageIntervalActive = false;
    const customerStoriesPath = "/customerstories";
    let previousPath = router.asPath;
    router.events.on("routeChangeComplete", (url) => {
      pathChangeEvent({ previousPath: previousPath, newPath: url });
      previousPath = url;
      if (url.includes(customerStoriesPath) && !customerStoryPageIntervalActive) {
        customerStoryPageInterval = setInterval(() => {
          customerStoryTimerEvent({});
        }, 30000);
        customerStoryPageIntervalActive = true;
      }
      else if (!url.includes(customerStoriesPath) && customerStoryPageIntervalActive) {
        clearInterval(customerStoryPageInterval);
        customerStoryPageIntervalActive = false;
      }
      else if (url.includes("thank-you")) {
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
