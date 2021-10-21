import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import Script from "next/script";

const ResourceContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;
  return (
    <>
      <Script
        id="marketo-js"
        src="//info.ujet.co/js/forms2/js/forms2.min.js"
        onLoad={() => {
          window.MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1638);
        }}
      />
      <section className="section">
        <div className="container">
          <div className="columns repeat-2">
            <div>
              <h1 className="heading-5">{resource.title}</h1>
              <div className="content mt" dangerouslySetInnerHTML={renderHTML(resource.text)} />
            </div>
            <div>
              <form id="mktoForm_1638"></form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceContent;
