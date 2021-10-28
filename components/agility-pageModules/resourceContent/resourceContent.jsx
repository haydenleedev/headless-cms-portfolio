import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import Script from "next/script";
import style from "./resourceContent.module.scss";
import { useEffect } from "react";
import Link from "next/link";

const ResourceContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;

  console.log(resource);
  useEffect(() => {
    var observer = new MutationObserver(function (mutations) {
      mutations[0].target.removeAttribute("class");
      mutations[0].target.removeAttribute("style");

      // TODO: Add hidden input for the following, add to head or data-layer
      // {{GA User ID}}
      // {{GA Cookie User ID}}
      // {{GA EM User ID}}
      // {{GA Page}}
      // {{GA Page}}
      // {{GA Date}}
      // {{GA Cookie Date}}
      // {{GA User ID - User}}
    });
    var form = document.getElementById("mktoForm_1638");
    observer.observe(form, {
      attributes: true,
    });
    return () => {
      window.MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1024);
    };
  }, []);
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
            <div className={`${style.form} marketo-resource`}>
              <h2 className={`${style.formTitle} heading-6`}>
                Fill out the form to download the {"<Resource>"} today!
              </h2>
              <form id="mktoForm_1638"></form>
              {resource.link.text && resource.link.href && (
                <p>
                  Want to learn more about UJET?
                  <Link href={resource.link.href}>
                    <a>{resource.link.title}</a>
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceContent;
