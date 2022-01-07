import { useEffect, useRef, useState } from "react";
import Slide from "./slide";
import style from "./slider.module.scss";

/**
 * A generic slider wrapper for displaying an array of content as slides.
 *
 * @param activeIndex the index of the element that should be visible by default.
 * @param loop if the parameter is provided, the slider controls will jump to the opposite end of the array when each of the ends is reached.
 * @param dots if the parameter is provided, dots will be displayed in order to represent which is the currently active index.
 * @param children the child elements defined within the slider component.
 */
const Slider = ({ activeIndex, loop, dots, children }) => {
  const sliderRef = useRef(null);
  const slideRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(activeIndex || 0);
  const [slideMaxWidth, setSlideMaxWidth] = useState(null);

  useEffect(() => {
    const updateSlideMaxWidth = () => {
      const sliderWidth = sliderRef.current.getBoundingClientRect().width;
      setSlideMaxWidth(sliderWidth);
    };
    if (sliderRef.current) {
      updateSlideMaxWidth();
      if (typeof window !== "undefined")
        window.addEventListener("resize", updateSlideMaxWidth);
    }
  }, [sliderRef.current]);

  const previousIndex = () => {
    if (currentIndex - 1 >= 0) setCurrentIndex(currentIndex - 1);
    else if (loop && Array.isArray(children) && currentIndex - 1 < 0)
      setCurrentIndex(children.length - 1);
  };
  const nextIndex = () => {
    switch (Array.isArray(children)) {
      case true:
        if (currentIndex + 1 < children.length)
          setCurrentIndex(currentIndex + 1);
        else if (loop) setCurrentIndex(0);
        break;
      default:
        break;
    }
  };

  return (
    <div className={style.slider} ref={sliderRef}>
      <div
        className={style.sliderTrack}
        style={{ transform: `translateX(${-currentIndex * slideMaxWidth}px)` }}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <Slide maxWidth={slideMaxWidth} ref={slideRefs.current[index]}>
              {child}
            </Slide>
          ))
        ) : (
          <Slide maxWidth={slideMaxWidth} ref={slideRefs.current[index]}>
            {children}
          </Slide>
        )}
      </div>
      <aside className={style.sliderControls}>
        {dots && (
          <ul className={style.dots}>
            {(Array.isArray(children) &&
              [...Array(children.length).keys()].map((key, index) => (
                <li key={"dot" + key}>
                  <button
                    className={`reset-button ${
                      currentIndex === index ? style.activeDot : ""
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  ></button>
                </li>
              ))) || (
              <button
                className={`reset-button ${
                  currentIndex === index ? style.activeDot : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            )}
          </ul>
        )}
        <div className={style.buttons}>
          <button
            onClick={previousIndex}
            className={`reset-button ${style.button}`}
          ></button>
          <button
            onClick={nextIndex}
            className={`reset-button ${style.button}`}
          ></button>
        </div>
      </aside>
    </div>
  );
};

export default Slider;
