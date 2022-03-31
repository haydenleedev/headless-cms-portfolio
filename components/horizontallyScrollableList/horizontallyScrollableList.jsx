import { useRef } from "react";
import style from "./horizontallyScrollableList.module.scss";

const HorizontallyScrollableList = ({ items, maxVisibleItems = 4 }) => {
  const itemContainerRef = useRef();
  const scrollHorizontally = (left) => {
    const element = itemContainerRef.current;
    const elementWidth = element.clientWidth;
    const maxScrollValue = element.scrollWidth - element.clientWidth;
    const currentScrollValue = parseInt(element.scrollLeft);
    const scrollPoints = [];
    for (let i = 0; i < items.length; i++) {
      scrollPoints.push(parseInt((elementWidth / maxVisibleItems) * i));
    }
    // Pixel values are sometimes rounded differently between scrollPoints and currentScrollPoint
    const pixelValueErrorMargin = 1;
    let targetScrollValue;
    if (currentScrollValue >= maxScrollValue - pixelValueErrorMargin && !left) {
      targetScrollValue = 0;
    } else if (currentScrollValue == 0 && left) {
      targetScrollValue = maxScrollValue;
    } else {
      if (left) {
        for (let i = scrollPoints.length - 1; i > 0; i--) {
          if (currentScrollValue - pixelValueErrorMargin > scrollPoints[i]) {
            targetScrollValue = scrollPoints[i];
            break;
          }
        }
      } else {
        for (let i = 0; i < scrollPoints.length; i++)
          if (currentScrollValue + pixelValueErrorMargin < scrollPoints[i]) {
            targetScrollValue = scrollPoints[i];
            break;
          }
      }
    }
    element.scrollLeft = targetScrollValue;
  };

  return (
    <>
      {items && (
        <div className={style.itemsWrapper}>
          <button
            className={`${style.scrollButton} reset-button`}
            onClick={() => scrollHorizontally(true)}
          />
          <div className={`${style.items}`} ref={itemContainerRef}>
            {items.map((item, index) => {
              return (
                <div
                  key={`item${index}`}
                  style={{ flexBasis: `calc(calc(100% / (${maxVisibleItems})` }}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <button
            className={`${style.scrollButton} reset-button`}
            onClick={() => scrollHorizontally(false)}
          />
        </div>
      )}
    </>
  );
};

export default HorizontallyScrollableList;
