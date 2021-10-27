import style from "./subscribe.module.scss";
import Script from "next/script";
import { useEffect } from "react";

const Subscribe = ({}) => {
  /*  Since we load the script lazyOnLoad we need to observe
    attribute changes in the form element in order to delete the styles that marketo loads after marketo injects them.
    Now we can override all marketo form styles easily.
   */
  useEffect(() => {
    var observer = new MutationObserver(function (mutations) {
      mutations[0].target.removeAttribute("class");
      mutations[0].target.removeAttribute("style");
    });
    var form = document.getElementById("mktoForm_1024");
    observer.observe(form, {
      attributes: true,
    });
  }, []);

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
        <form id="mktoForm_1024" className="marketo-subscribe"></form>
      </div>
    </>
  );
};

export default Subscribe;
