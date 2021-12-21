import { useRef, useEffect } from "react";

/*
 This custom hook helps using the intersectionObserver API whenever needed without needing to manually set it up every time
 
 Props:
 options - options passed to the the intersectionObserver() constructor
 intersectionRatioThreshold - a threshold value (0.0 - 1.0) which the intersectionRatio value is compared against (>)
 callback - the callback function that gets called when an intersection is 
 reference:
*/
export const useIntersectionObserver = (
  options,
  intersectionRatioThreshold,
  callback
) => {
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > intersectionRatioThreshold) callback?.();
      });
    }, options);

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return ref;
};
