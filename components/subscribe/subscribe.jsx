import style from "./subscribe.module.scss";
import Script from "next/script";

const Subscribe = ({}) => {

  return (
    <>
      <Script
        id="marketo-newsletter-js"
        src="//info.ujet.co/js/forms2/js/forms2.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1024);
        }}
      />
      <div className={style.subscribe}>
        <span className={style.heading}>Subscribe</span>
        <p className={style.title}>
          The best customer experience content delivered right to your inbox.
        </p>
        <form id="mktoForm_1024"></form>

        {/* <form>
          <label htmlFor="email" className={style.label}>
            <span aria-hidden className="color-red">
              *{" "}
            </span>
            Business email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Please enter your business email"
            required
            aria-required
          ></input>
          <label htmlFor="country" className={style.label}>
            <span aria-hidden className="color-red">
              *{" "}
            </span>
            Country (Corp HQ)
          </label>
          <input
            id="country"
            name="country"
            type="text"
            placeholder="Please enter your company's country"
            required
            aria-required
          ></input>
          <label htmlFor="state" className={style.label}>
            <span aria-hidden className="color-red">
              *{" "}
            </span>
            Country (Corp HQ)
          </label>
          <input
            id="state"
            name="state"
            type="text"
            placeholder="Please enter your company's state"
            required
            aria-required
          ></input>
          <button type="submit" className={`button ${style.subscribeButton}`}>
            Subscribe to UJET Blog
          </button>
        </form> */}
      </div>
    </>
  );
};

export default Subscribe;
