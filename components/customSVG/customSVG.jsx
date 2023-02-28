import { useContext, useEffect } from "react";
import GlobalContext from "../../context";

const CustomSVG = ({ svgClasses, svgInput, animateSVG }) => {
  const { canLoadOptimize } = useContext(GlobalContext);
  const disableAnimation =
    animateSVG === "static" ? "first-fold-svg-animation-unset" : "";

  useEffect(() => {
    if (canLoadOptimize)
      document.documentElement.style.setProperty(
        "--cloud-animation-state",
        "running"
      );
  }, [canLoadOptimize]);
  return canLoadOptimize ? (
    <div
      className={`${svgClasses} ${disableAnimation}`}
      dangerouslySetInnerHTML={{ __html: svgInput }}
    ></div>
  ) : (
    <div
      className={`${svgClasses} first-fold-svg-animation-unset`}
      dangerouslySetInnerHTML={{ __html: svgInput }}
    ></div>
  );
};

export default CustomSVG;
