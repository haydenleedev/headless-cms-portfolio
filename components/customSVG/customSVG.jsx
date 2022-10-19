const CustomSVG = ({ svgClasses, svgInput, animateSVG }) => {
  const disableAnimation =
    animateSVG === "static" ? "first-fold-svg-animation-unset" : "";
  return (
    <div
      className={`${svgClasses} ${disableAnimation}`}
      dangerouslySetInnerHTML={{ __html: svgInput }}
    ></div>
  );
};

export default CustomSVG;
