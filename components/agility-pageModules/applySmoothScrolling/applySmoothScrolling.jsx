import { useRouter } from "next/router";
import { useEffect } from "react";
import { sleep } from "../../../utils/generic";

// this module is used to apply the smooth scrolling effect on a page (when clicking anchor links inside the page)
const ApplySmoothScrolling = () => {
  const router = useRouter();
  const isBrowser = typeof window !== "undefined";

  // TODO: figure how to make this work
  useEffect(() => {
    const handleHashChangeStart = () => {};
    const handleHashChangeComplete = (path) => {
      if (isBrowser) {
        const splitPath = path.split("#");
        if (splitPath.length > 1) {
          const anchoredElement = document.getElementById(splitPath[1]);
          sleep(1).then(() => {
            window.scroll({
              behavior: "smooth",
              left: 0,
              top:
                anchoredElement?.getBoundingClientRect?.().top + window.scrollY,
            });
          });
        }
      }
    };
    router.events.on("hashChangeComplete", handleHashChangeComplete);
    router.events.on("hashChangeStart", handleHashChangeStart);

    return () => {
      router.events.off("hashChangeComplete", handleHashChangeComplete);
      router.events.off("hashChangeStart", handleHashChangeStart);
    };
  }, []);

  return null;
};

export default ApplySmoothScrolling;
