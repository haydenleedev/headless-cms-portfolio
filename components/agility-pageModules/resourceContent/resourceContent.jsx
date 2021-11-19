import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import style from "./resourceContent.module.scss";
import { useEffect } from "react";
import Link from "next/link";
import { boolean } from "../../../utils/validation";
import { Form, FormWrapper } from "../../form";

const ResourceContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;
  
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
            <Form />
            {resource.link.text && resource.link.href && (
              <p>
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
              <Form />
            </div>
          </div>
        </div>
        {resource.link.text && resource.link.href && (
          <div className="container">
            <p className={style.alternateLink}>
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
    <FormWrapper>
      {boolean(resource.alternateLayout) ? (
        <AlternateLayout resource={resource}></AlternateLayout>
      ) : (
        <BasicLayout resource={resource}></BasicLayout>
      )}
    </FormWrapper>
  );
};

export default ResourceContent;
