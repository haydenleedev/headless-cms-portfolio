// This exists so we can check the viewport in Javascript..
// IMPORTANT: remember to sync variable changes with scss definitions

export const touchWidth = 768;

export const isMobile = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < touchWidth) {
      return true;
    }
    return false;
  }
};
