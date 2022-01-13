import { forwardRef } from "react";
import style from "./slide.module.scss";

const Slide = forwardRef(
  ({ maxWidth, handleTouchStart, handleTouchMove, children }, ref) => {
    return (
      <div
        className={style.slide}
        style={{ maxWidth: `${maxWidth}px` }}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {children}
      </div>
    );
  }
);
Slide.displayName = "Slide";
export default Slide;
