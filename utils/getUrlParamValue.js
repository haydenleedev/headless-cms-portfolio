export const getUrlParamValue = (paramName, defaultValue = "") => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const urlParamValue = urlParams.get(paramName);
    return urlParamValue || defaultValue;
  }
};
