import { useEffect, useRef } from "react";
import { sleep } from "../../utils/generic";
import style from "./fade.module.scss";

const Fade = ({ duration, trigger, children }) => {
  const ref = useRef(null);

  // fade content in when ref mounts
  useEffect(() => {
    if (ref.current) {
      ref.current.style["animation-duration"] = `${duration}ms`;
      ref.current.classList.add(style.fadein);
    }
  }, [ref.current]);

  // trigger fade out / fade in sequence when trigger prop is changed
  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add(style.fadeout);
      ref.current.classList.remove(style.fadein);
      sleep(duration).then(() => {
        ref.current.classList.add(style.fadein);
        ref.current.classList.remove(style.fadeout);
      });
    }
  }, [trigger]);

  return (
    <div className={style.fadeComponent} ref={ref}>
      {children}
    </div>
  );
};

export default Fade;
