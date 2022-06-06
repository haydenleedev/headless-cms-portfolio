export const thirtySecondTimer = (setTriggered) => {
  setTimeout(() => {
    setTriggered(true);
  }, 30000);
};

export const marketoScriptReady = (setTriggered) => {
  const updateTriggeredStatus = () => {
    setTriggered(true);
    window.removeEventListener("marketoScriptReady", updateTriggeredStatus);
  };
  window.addEventListener("marketoScriptReady", updateTriggeredStatus);
};

export const marketoFormSuccess = (setTriggered) => {
  const updateTriggeredStatus = () => {
    setTriggered(true);
  }
  window.addEventListener("marketoFormSuccess", updateTriggeredStatus);
}