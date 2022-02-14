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
