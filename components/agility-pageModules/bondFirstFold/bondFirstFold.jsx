import style from "./bondFirstFold.module.scss";
import AgilityLink from "../../agilityLink";
import { useRef } from "react";

const BondFirstFold = ({ module }) => {
  const { fields } = module;
  const barrelRef = useRef(null);

  const spinIn = () => {
    barrelRef.current.classList.remove(style.barrelSpinOut);
    barrelRef.current.classList.add(style.barrelSpinIn);
  };
  const spinOut = () => {
    barrelRef.current.classList.remove(style.barrelSpinIn);
    barrelRef.current.classList.add(style.barrelSpinOut);
  };
  return (
    <section
      className={`section ${style.bondFirstFold}`}
      data-navbar-hidden="true"
      id={fields.id ? fields.id : null}
    >
      <div className={style.backgroundImage}>
        <img
          src="https://assets.ujet.cx/barrel-purple.svg"
          alt=""
          ref={barrelRef}
        />
      </div>
      <div className={style.backgroundGradient}></div>
      <div className="container">
        <div className={style.cornerLogo}>
          <img src="https://assets.ujet.cx/ujet-logo-white.svg" alt="" />
        </div>
        <div className={style.content}>
          <AgilityLink
            agilityLink={fields.formLink}
            ariaLabel={`Navigate to ${fields.formLink}`}
          >
            <div
              className={style.circleWrapper}
              onMouseEnter={spinIn}
              onMouseLeave={spinOut}
            >
              <div className={style.circleInner}>
                <img
                  src="https://assets.ujet.cx/ujet-cx-logo-01.svg"
                  width="168"
                  alt=""
                />
                <p>{fields.title}</p>
                <div className="button">{fields.formLink.text}</div>
              </div>
            </div>
          </AgilityLink>
        </div>
      </div>
    </section>
  );
};

export default BondFirstFold;
