/* Nested naming so you can quickly find the files with ctrl + P in VS Code
Becomes a nightmare to manage if they're all named index.jsx... */
import Footer from "./footer/footer";
import Navbar from "./navbar/navbar";
import GlobalMessage from "./globalMessage/globalMessage";
import SEO from "../SEO";
import { getPageTemplate } from "../agility-pageTemplates";
import { handlePreview } from "@agility/nextjs";
import { useRouter } from "next/router";
import Error from "next/error";

const isPreview = handlePreview();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const Layout = (props) => {
  const { page, sitemapNode, dynamicPageItem, notFound, pageTemplateName } =
    props;
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  const router = useRouter();
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  // if page not found, throw 404
  if (notFound === true) {
    return <Error statusCode={404} />;
  }

  const AgilityPageTemplate = getPageTemplate(pageTemplateName);

  if (dynamicPageItem?.seo?.metaDescription) {
    page.seo.metaDescription = dynamicPageItem.seo.metaDescription;
  }

  return (
    <>
      <SEO
        title={sitemapNode?.title}
        description={page.seo.metaDescription}
        keywords={page.seo.metaKeywords}
        metaHTML={page.seo.metaHTML}
        url={siteUrl + sitemapNode.path}
      />
      {isPreview && <p>Loading preview mode...</p>}
      {!isPreview && (
        <>
          <GlobalMessage {...props}></GlobalMessage>
          <Navbar {...props}></Navbar>
          <main>
            <AgilityPageTemplate {...props} />
          </main>
          <Footer {...props}></Footer>
        </>
      )}
    </>
  );
};

export default Layout;
