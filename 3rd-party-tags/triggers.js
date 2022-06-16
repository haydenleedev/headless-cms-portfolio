export const thirtySecondTimer = (setEventStatus) => {
  setTimeout(() => {
    setEventStatus({ triggered: true });
  }, 30000);
};

export const marketoScriptReady = (setEventStatus) => {
  const updateTriggeredStatus = () => {
    setEventStatus({ triggered: true });
    window.removeEventListener("marketoScriptReady", updateTriggeredStatus);
  };
  window.addEventListener("marketoScriptReady", updateTriggeredStatus);
};

export const marketoFormSuccess = (setEventStatus) => {
  const updateTriggeredStatus = () => {
    setEventStatus({ triggered: true });
  };
  window.addEventListener("marketoFormSuccess", updateTriggeredStatus);
};

export const elementClick = (setEventStatus) => {
  window.addEventListener("click", (e) => {
    if (e.target.nodeName !== "A" && e.target.parent?.nodeName !== "A") {
      setEventStatus({
        triggered: true,
        details: { elementClasses: e.target.className },
      });
    }
  });
};

export const linkClick = (setEventStatus) => {
  window.addEventListener("click", (e) => {
    if (e.target.nodeName === "A" || e.target.parent?.nodeName === "A") {
      setEventStatus({
        triggered: true,
        details: { linkText: e.target.innerHTML },
      });
    }
  });
};

export const internalLinkClick = (setEventStatus) => {
  window.addEventListener("click", (e) => {
    if (
      (e.target.nodeName === "A" &&
        e.target.href.includes(process.env.NEXT_PUBLIC_SITE_URL)) ||
      (e.target.parent?.nodeName === "A" &&
        e.target.parent?.href.includes(process.env.NEXT_PUBLIC_SITE_URL))
    ) {
      setEventStatus({
        triggered: true,
        details: { linkText: e.target.innerHTML },
      });
    }
  });
};

export const phoneNumberClick = (setEventStatus) => {
  window.addEventListener("click", (e) => {
    if (e.target.nodeName === "A" && e.target.href.includes("tel:")) {
      setEventStatus({
        triggered: true,
        details: { linkText: e.target.innerHTML },
      });
    }
  });
};

export const youTubeActivity = (setEventStatus) => {
  const updateTriggeredStatus = (e) => {
    setEventStatus({ triggered: true, details: { action: e.detail.action } });
  };
  window.addEventListener("youTubeActivity", updateTriggeredStatus);
};
