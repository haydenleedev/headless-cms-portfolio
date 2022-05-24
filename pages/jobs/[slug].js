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
import JobApplicationForm from "../../components/jobApplicationForm/jobApplicationForm";
import agility from "@agility/content-fetch";
import { useRouter } from "next/router";
import Error from "next/error";

export async function getStaticProps({ params }) {
  const jobData = await fetch(
    `${process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT}/${params.slug}`,
    { method: "GET" }
  );
  const jobJsonData = await jobData.json();
  let notFound = false;
  if (jobJsonData.status == 404) {
    notFound = true;
  }
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
  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
    isPreview: false,
  });
  const formConfig = await api.getContentItem({
    contentID: 5499,
    languageCode: "en-us",
  });
  const sanitizeHtml = (await import("sanitize-html")).default;
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  formConfig.fields.generalSelfIdentificationText = cleanHtml(
    formConfig.fields.generalSelfIdentificationText
  );
  formConfig.fields.veteranSelfIdentificationText = cleanHtml(
    formConfig.fields.veteranSelfIdentificationText
  );
  formConfig.fields.disabilitySelfIdentificationText = cleanHtml(
    formConfig.fields.disabilitySelfIdentificationText
  );
  formConfig.fields.footnoteText = cleanHtml(formConfig.fields.footnoteText);
  return {
    props: { jobData: jobJsonData, agilityProps, formConfig, notFound },
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
  const { jobData, agilityProps, formConfig, notFound } = props;
  const [content, setContent] = useState(null);
  const { asPath } = useRouter();
  const jobId = asPath.split("/jobs/")[1];

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

  if (notFound == true) {
    return <Error statusCode={404} />;
  }

  return (
    <Layout {...agilityProps}>
      <section className="section">
        <div className="container">
          {content && (
            <>
              <h1 className="heading-4 pb-3">{jobData.title}</h1>
              <div dangerouslySetInnerHTML={renderHTML(content)} />
              <JobApplicationForm
                positionName={jobData.title}
                config={formConfig}
                jobId={jobId}
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default JobOpeningPage;
