import { getAgilityPageProps } from "@agility/nextjs/node";
import Layout from "../../components/layout/layout";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import GlobalMessage from "../../components/layout/globalMessage/globalMessage";
import GlobalSettings from "../../components/layout/globalSettings";
import { getModule } from "../../components/agility-pageModules";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../utils/convert";
import { useState, useEffect } from "react";

export async function getStaticProps({ params }) {
  const jobData = await fetch(
    `${process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT}/${params.slug}`,
    { method: "GET" }
  );
  const jobJsonData = await jobData.json();
  const globalComponents = {
    navbar: Navbar,
    globalMessage: GlobalMessage,
    footer: Footer,
    globalSettings: GlobalSettings,
  };
  const agilityProps = await getAgilityPageProps({
    // params,
    // locale,
    getModule,
    // defaultLocale,
    globalComponents,
  });
  return {
    props: { jobData: jobJsonData, agilityProps },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const jobListData = await fetch(
    process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT,
    { method: "GET" }
  );
  const jobListJsonData = await jobListData.json();
  const paths = jobListJsonData.jobs.map((job) => ({
    params: { slug: job.id.toString() },
  }));
  return { paths, fallback: "blocking" };
}

const JobOpeningPage = (props) => {
  const { jobData, agilityProps } = props;
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const processContent = async () => {
        const txt = document.createElement("textarea");
        txt.innerHTML = jobData.content;
        const decodedContent = txt.value;
        const sanitizeHtml = (await import("sanitize-html")).default;
        const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
        const sanitizedHtml = cleanHtml(decodedContent);
        setContent(sanitizedHtml);
      };
      processContent();
    }
  }, []);

  return (
    <Layout {...agilityProps}>
      <section className="section">
        <div className="container">
          <h1 className="heading-4">{jobData.title}</h1>
          {content && <div dangerouslySetInnerHTML={renderHTML(content)} />}
        </div>
      </section>
    </Layout>
  );
};

export default JobOpeningPage;
