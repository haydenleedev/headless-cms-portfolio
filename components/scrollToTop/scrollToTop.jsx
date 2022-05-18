import style from "./scrollToTop.module.scss";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrolled, setScrolled] = useState();
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    scrollProgress();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollProgress = () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolledTemp = `${(scrollPx / winHeightPx) * 100}%`;
    setScrolled(scrolledTemp);
  };
  const toTop = () => {
    window.scroll({
      behavior: "smooth",
      left: 0,
      top: 0,
    });
  };
  const progressBarStyle = {
    height: ".1rem",
    background: "#151552",
    width: scrolled,
  };
  return (
    <button
      onClick={toTop}
      className={`${style.scrollToTopButton} ${
        scrollPosition > 150 ? "" : style.hidden
      }`}
    >
      Scroll to top
      <div className={style.progressBarWrapper}>
      <div className={style.progressBarContainer}>
        <div className="progress-bar" style={progressBarStyle} />
      </div>
      </div>
    </button>
  );
};
export default ScrollToTop;
