import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import Script from "next/script";
import style from "./resourceContent.module.scss"
const ResourceContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;
  return (
    <>
      <Script
        id="marketo-js"
        src="//info.ujet.co/js/forms2/js/forms2.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1638);
        }}
      />
      {/* <Script src="//info.ujet.co/js/forms2/js/forms2.min.js" />
      <Script id="marketo-js">{`window.MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1638);`}</Script> */}
      <section className="section">
        <div className="container">
          <div className="columns repeat-2">
            <div className={style.content}>
              <h1 className="heading-5">{resource.title}</h1>
              <div className="content mt" dangerouslySetInnerHTML={renderHTML(resource.text)} />
            </div>
            <div className={style.form}>
              <form id="mktoForm_1638"></form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceContent;
