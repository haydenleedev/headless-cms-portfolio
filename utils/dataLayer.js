export const formSubmissionEvent = (data) => {
  window.dataLayer?.push({
    event: "formSubmission",
    formCategory: "Marketo Form",
    formAction: "Form Submission",
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

export const internalLinkClickEvent = (data) => {
  window.dataLayer?.push({
    event: "internalLinkClick",
    ...data,
  });
};
