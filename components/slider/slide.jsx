import { forwardRef } from "react";
import style from "./slide.module.scss";

const Slide = forwardRef(({ maxWidth, children }, ref) => {
  return (
    <div
      className={style.slide}
      style={{ maxWidth: `${maxWidth}px` }}
      ref={ref}
    >
      {children}
    </div>
  );
});
Slide.displayName = "Slide";
export default Slide;
