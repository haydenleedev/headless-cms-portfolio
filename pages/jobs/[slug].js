import { getAgilityPageProps } from "@agility/nextjs/node";
import Layout from "../../components/layout/layout";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import GlobalMessage from "../../components/layout/globalMessage/globalMessage";
import GlobalSettings from "../../components/layout/globalSettings";
import { getModule } from "../../components/agility-pageModules";
import { renderHTML } from "@agility/nextjs";
import { formatPageTitle, sanitizeHtmlConfig } from "../../utils/convert";
import { useState, useEffect } from "react";
import JobApplicationForm from "../../components/jobApplicationForm/jobApplicationForm";
import agility from "@agility/content-fetch";
import Error from "next/error";
import style from "../../components/jobApplicationForm/jobApplicationForm.module.scss";

export async function getStaticProps({ params }) {
  const jobData = await fetch(
    `${process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT}/${params.slug}?questions=true`,
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
  const globalSettings = await api.getContentItem({
    contentID: 241,
    languageCode: "en-us",
  });

  const pageTitleSuffix = globalSettings.fields.pageTitleSuffix;

  agilityProps.sitemapNode.title = formatPageTitle(
    jobJsonData.title,
    pageTitleSuffix
  );

  agilityProps.page.seo.metaDescription = "";

  return {
    props: {
      jobData: jobJsonData,
      agilityProps,
      notFound,
    },
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
  const { jobData, agilityProps, notFound } = props;
  const [pageTextContent, setPageTextContent] = useState(null);
  const [formComplianceContentProcessed, setFormComplianceContentProcessed] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const processContent = async () => {
        const txt = document.createElement("textarea");
        txt.innerHTML = jobData.content;
        const decodedContent = txt.value;
        const sanitizeHtml = (await import("sanitize-html")).default;
        const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
        const sanitizedHtml = cleanHtml(decodedContent);
        setPageTextContent(sanitizedHtml);
        jobData?.compliance?.forEach?.((item) => {
          const descriptionTextArea = document.createElement("textarea");
          descriptionTextArea.innerHTML = item.description;
          const decodedDescription = descriptionTextArea.value;
          item.description = cleanHtml(decodedDescription);
        });
        setFormComplianceContentProcessed(true);
      };
      processContent();
    }
  }, []);

  if (notFound == true) {
    return <Error statusCode={404} />;
  }

  return (
    <Layout {...agilityProps}>
      <section className={`section ${style.jobApplication}`}>
        <div className="container">
          {pageTextContent && formComplianceContentProcessed ? (
            <>
              <h1 className="heading-4 pb-3">{jobData.title}</h1>
              <div dangerouslySetInnerHTML={renderHTML(pageTextContent)} />
              <JobApplicationForm jobData={jobData} />
            </>
          ) : (
            <p className="text-36px w-600">Loading...</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default JobOpeningPage;
