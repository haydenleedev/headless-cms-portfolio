import { useEffect, useRef, useState } from "react";
import style from "./modal.module.scss";

const Modal = ({ trigger, closeCallback, children }) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!mounted) setMounted(true);
    else setActive(!active);
  }, [trigger]);

  useEffect(() => {
    if (active) {
      // close modal if outside area is clicked
      const handleOutsideModalClick = (event) => {
        const modalOffsetLeft = modalRef?.current?.offsetParent?.offsetLeft;
        const modalOffsetTop = modalRef?.current?.offsetParent?.offsetTop;
        const modalOffsetParentWidth =
          modalRef?.current?.offsetParent?.offsetWidth;
        const modalOffsetParentHeight =
          modalRef?.current?.offsetParent?.offsetHeight;
        const modalBounds = [
          [modalOffsetLeft, modalOffsetTop],
          [
            modalOffsetLeft + modalOffsetParentWidth,
            modalOffsetTop + modalOffsetParentHeight,
          ],
        ];
        const mousePos = [event.clientX, event.clientY];
        if (
          mousePos[0] < modalBounds[0][0] ||
          mousePos[0] > modalBounds[1][0] ||
          mousePos[1] < modalBounds[0][1] ||
          mousePos[1] > modalBounds[1][1]
        ) {
          setActive(false);
          closeCallback?.();
        }
      };
      document.addEventListener("click", handleOutsideModalClick);

      return () => {
        document.removeEventListener("click", handleOutsideModalClick);
      };
    }
  }, [active, modalRef.current]);

  return active ? (
    <div className={style.modal}>
      <div className={style.wrapper}>
        <div className={style.background}></div>
        <div className={`container ${style.content}`}>
          <div className={style.contentWrapper} ref={modalRef}>
            {children}
            <button
              className={`reset-button ${style.closeButton}`}
              onClick={() => setActive(false)}
            >
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
