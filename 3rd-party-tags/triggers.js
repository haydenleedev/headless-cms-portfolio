import { Router } from "next/router";

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

export const scrollDepth = (setEventStatus) => {
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
        setEventStatus({
          triggered: true,
          details: { scrollDepth: scrollBreakpoints[i].threshold },
        });
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
              setEventStatus({
                triggered: true,
                details: { scrollDepth: scrollBreakpoints[i].threshold },
              });
            }
          } else if (
            scrollPercentage >= scrollBreakpoints[i].threshold &&
            !scrollBreakpoints[i].triggered
          ) {
            scrollBreakpoints[i].triggered = true;
            triggerPreviousScrollBreakpoints(i);
            setEventStatus({
              triggered: true,
              details: { scrollDepth: scrollBreakpoints[i].reportValue },
            });
          }
        }
      }, 500);
    }
  });
  Router.events.on("routeChangeComplete", () => {
    // Reset scroll triggers on page change
    scrollBreakpoints.forEach((breakpoint) => {
      breakpoint.triggered = false;
    });
  });
};
