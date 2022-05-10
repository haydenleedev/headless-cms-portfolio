import { useEffect, useRef, useState } from "react";
import style from "./horizontallyScrollableList.module.scss";

const HorizontallyScrollableList = ({ items, maxVisibleItems = 4 }) => {
  const [leftArrowInactive, setLeftArrowInactive] = useState(false);
  const [rightArrowInactive, setRightArrowInactive] = useState(false);
  const itemContainerRef = useRef();
  // Pixel values are sometimes rounded differently between variables
  const pixelValueErrorMargin = 1;
  const scrollHorizontally = (left) => {
    const itemContainer = itemContainerRef.current;
    const elementWidth = itemContainer.clientWidth;
    const maxScrollValue =
      itemContainer.scrollWidth - itemContainer.clientWidth;
    const currentScrollValue = parseInt(itemContainer.scrollLeft);
    const scrollPoints = [];
    for (let i = 0; i < items.length - (maxVisibleItems - 1); i++) {
      scrollPoints.push(parseInt((elementWidth / maxVisibleItems) * i));
    }
    let targetScrollValue;
    if (
      (currentScrollValue >= maxScrollValue - pixelValueErrorMargin && !left) ||
      (currentScrollValue == 0 && left)
    ) {
      return;
    } else if (left) {
      for (let i = scrollPoints.length - 1; i > 0; i--) {
        if (currentScrollValue - pixelValueErrorMargin > scrollPoints[i]) {
          targetScrollValue = scrollPoints[i];
          break;
        }
      }
      if (!targetScrollValue) {
        targetScrollValue = scrollPoints[0];
      }
    } else {
      for (let i = 0; i < scrollPoints.length; i++) {
        if (currentScrollValue + pixelValueErrorMargin < scrollPoints[i]) {
          targetScrollValue = scrollPoints[i];
          break;
        }
        if (!targetScrollValue) {
          targetScrollValue = maxScrollValue;
        }
      }
    }
    itemContainer.scrollLeft = targetScrollValue;
  };

  // Throttling should not be used for this function because it causes unreliability
  const setButtonDisabledStatuses = () => {
    const itemContainer = itemContainerRef.current;
    const scrollValue = itemContainer.scrollLeft;
    const maxScrollValue =
      itemContainer.scrollWidth - itemContainer.clientWidth;
    if (scrollValue == 0) {
      setLeftArrowInactive(true);
    } else if (scrollValue >= maxScrollValue - pixelValueErrorMargin) {
      setRightArrowInactive(true);
    } else {
      setLeftArrowInactive(false);
      setRightArrowInactive(false);
    }
  };

  useEffect(() => {
    // Set initial disabled values for buttons
    setButtonDisabledStatuses();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", setButtonDisabledStatuses);
    }
    return () => {
      window.removeEventListener("resize", setButtonDisabledStatuses);
    };
  }, []);

  return (
    <>
      {items && (
        <div className={style.itemsWrapper}>
          <button
            className={`${style.scrollButton} reset-button`}
            disabled={leftArrowInactive}
            onClick={() => scrollHorizontally(true)}
          />
          <ul
            className={`${style.items}`}
            ref={itemContainerRef}
            onScroll={setButtonDisabledStatuses}
          >
            {items.map((item, index) => {
              return (
                <li
                  key={`item${index}`}
                  style={{ flexBasis: `${100 / maxVisibleItems}%` }}
                >
                  {item}
                </li>
              );
            })}
          </ul>
          <button
            className={`${style.scrollButton} reset-button`}
            disabled={rightArrowInactive}
            onClick={() => scrollHorizontally(false)}
          />
        </div>
      )}
    </>
  );
};

export default HorizontallyScrollableList;
