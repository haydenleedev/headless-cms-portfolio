import style from "./bondFirstFold.module.scss";
import AgilityLink from "../../agilityLink";

const BondFirstFold = ({ module }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${style.bondFirstFold}`}
      data-navbar-hidden="true"
    >
      <div className={style.backgroundImage}>
        <img src="https://assets.ujet.cx/barrel-purple.svg" alt="" />
      </div>
      <div className="container">
        <div className={style.cornerLogo}>
          <img src="https://assets.ujet.cx/ujet-logo-white.svg" alt="" />
        </div>
        <div className={style.content}>
          <AgilityLink agilityLink={fields.formLink}>
            <div className={style.circleWrapper}>
              <div className={style.circleInner}>
                <img
                  src="https://assets.ujet.cx/ujet-cx-logo-01.svg"
                  width="168"
                  alt=""
                />
                <p>{fields.title}</p>
                <a className="button">{fields.formLink.text}</a>
              </div>
            </div>
          </AgilityLink>
        </div>
      </div>
    </section>
  );
};

export default BondFirstFold;
