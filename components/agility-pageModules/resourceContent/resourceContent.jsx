import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import Script from "next/script";
import style from "./resourceContent.module.scss";
import { useEffect } from "react";
import Link from "next/link";
import { boolean } from "../../../utils/validation";

const ResourceContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;

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

  const BasicLayout = ({ resource }) => (
    <section className="section">
      <div className="container">
        <div className="columns repeat-2">
          <div className={style.content}>
            <h1 className="heading-5">{resource.title}</h1>
            <div
              className="content mt-4"
              dangerouslySetInnerHTML={renderHTML(resource.text)}
            />
          </div>
          <div className={`${style.form} marketo-resource`}>
            <h2 className={`${style.formTitle} heading-6`}>
              {resource.formTitle ||
                "Fill out the form to download the the resource today!"}
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
  );

  const AlternateLayout = ({ resource }) => (
    <>
      <section className={style.alternateHeader}>
        <div className={style.alternateHeaderColumns}>
          <div className={style.contentColumn} aria-hidden></div>
          <div className={style.imageColumn}>
            <AgilityImage
              src={resource.image.url}
              alt={resource.image.label || null}
              width={resource.image.pixelWidth}
              height={resource.image.pixelHeight}
              objectFit="cover"
            />
          </div>
          <div
            className={`section container ${style.alternateHeaderContainer}`}
          >
            <p className={style.category}>Render category here</p>
            <span className={style.hr}></span>
            <h1 className={`${style.title} heading-5`}>{resource.title}</h1>
          </div>
        </div>
      </section>
      <section className="section">
        <div className={`container ${style.alternateContent}`}>
          <div className="columns repeat-2">
            <div
              className="content"
              dangerouslySetInnerHTML={renderHTML(resource.text)}
            />
            <div className={`marketo-resource`}>
              <h2 className={`${style.alternateFormTitle} heading-6`}>
                {resource.formTitle ||
                  "Fill out the form to download the the resource today!"}
              </h2>
              <form id="mktoForm_1638"></form>
            </div>
          </div>
        </div>
        {resource.link.text && resource.link.href && (
          <div className="container">
            <p className={style.alternateLink}>
              Want to learn more about UJET?
              <Link href={resource.link.href}>
                <a className="link ml-4">{resource.link.text}</a>
              </Link>
            </p>
          </div>
        )}
      </section>
    </>
  );

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
      {boolean(resource.alternateLayout) ? (
        <AlternateLayout resource={resource}></AlternateLayout>
      ) : (
        <BasicLayout resource={resource}></BasicLayout>
      )}
    </>
  );
};

export default ResourceContent;
