import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import Script from "next/script";
import style from "./pressReleaseContent.module.scss";

const PressReleaseContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;

  return (
    <article className={style.pressReleaseContent}>
      <section className={`section ${style.firstFold}`}>
        <div className={style.backgroundImage}>
          <AgilityImage
            src={resource.image.url}
            alt={resource.image.label || null}
            width={resource.image.pixelWidth}
            height={resource.image.pixelHeight}
            objectFit="cover"
          />
        </div>
        <div className={style.backgroundFilter}></div>
        <div className={`container ${style.title}`}>
          <h1>{resource.title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div
            className="content"
            dangerouslySetInnerHTML={renderHTML(resource.text)}
          ></div>
        </div>
      </section>
    </article>
  );
};

export default PressReleaseContent;
