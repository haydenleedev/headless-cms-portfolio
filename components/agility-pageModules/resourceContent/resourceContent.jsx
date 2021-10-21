import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";

const ResourceContent = ({ dynamicPageItem }) => {
  const resource = dynamicPageItem.fields;
  console.log(resource);
  return (
    <>
      <Head>
        <script async src="//info.ujet.co/js/forms2/js/forms2.min.js"></script>
      </Head>
      <section className="section">
        <div className="container">
          <div className="columns repeat-2">
            <div>
              <h1 className="heading-5">{resource.title}</h1>
              <div className="content mt" dangerouslySetInnerHTML={renderHTML(resource.text)} />
            </div>
            <div>
              <script
                async
                dangerouslySetInnerHTML={{ __html: `MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1638);` }}
              ></script>
              <form id="mktoForm_1638"></form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceContent;
