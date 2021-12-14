const CustomSVG = ({ svgClasses, svgInput }) => {
  return (
    <div
      className={svgClasses}
      dangerouslySetInnerHTML={{ __html: svgInput }}
    ></div>
  );
};

export default CustomSVG;
