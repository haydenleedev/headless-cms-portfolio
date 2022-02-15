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

export const phoneNumberClickEvent = (data) => {
  window.dataLayer?.push({
    event: "phoneNumberClick",
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

export const internalLinkClickEvent = (data) => {
  window.dataLayer?.push({
    event: "internalLinkClick",
    ...data,
  });
};

export const addDataLayerEventTriggers = (router) => {
  if (typeof window !== "undefined") {
    // Regular timer triggers
    setInterval(() => {
      thirtySecondTimerEvent({});
    }, 30000);
    setInterval(() => {
      sixtySecondTimerEvent({});
    }, 60000);
    // Customer story page timer trigger
    let customerStoryPageInterval;
    let customerStoryPageIntervalActive = false;
    const customerStoryPath = "/customerstories"
    router.events.on("routeChangeComplete", (url) => {
      if (url.includes(customerStoryPath) && !customerStoryPageIntervalActive) {
        customerStoryPageInterval = setInterval(() => {
          customerStoryTimerEvent({});
        }, 30000);
        customerStoryPageIntervalActive = true;
      }
      else if (!url.includes(customerStoryPath) && customerStoryPageIntervalActive) {
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
        if (e.target.href.includes("tel:")) {
          phoneNumberClickEvent({});
        }
        else if (e.target.href.includes(process.env.NEXT_PUBLIC_SITE_URL)) {
          internalLinkClickEvent({});
        }
      }
    });
  }
}
