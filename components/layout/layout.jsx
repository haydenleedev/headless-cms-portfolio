/* Nested naming so you can quickly find the files with ctrl + P in VS Code
Becomes a nightmare to manage if they're all named index.jsx... */
import Footer from "./footer/footer";
import Navbar from "./navbar/navbar";
import BrandNavbar from "./brandNavbar/brandNavbar";
import GlobalMessage from "./globalMessage/globalMessage";
import SEO from "../SEO";
import { getPageTemplate } from "../agility-pageTemplates";
import { handlePreview } from "@agility/nextjs";
import { useRouter } from "next/router";
import Error from "next/error";
import Head from "next/head";
import { addDataLayerEventTriggers } from "../../utils/dataLayer";
import { useEffect } from "react";
import BrandFooter from "./brandFooter/brandFooter";

const isPreview = handlePreview();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const Loader = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <p>Loading...</p>
    </>
  );
};

const Layout = (props) => {
  const {
    page,
    sitemapNode,
    dynamicPageItem,
    notFound,
    pageTemplateName,
    children, // for pages created manually in the next.js pages folder
  } = props;

  const router = useRouter();
  let initialPageLoaded = false;

  useEffect(() => {
    addDataLayerEventTriggers(router);
    router.events.on("routeChangeComplete", () => {
      // Track virtual page views (Bombora)
      if (window._ml && initialPageLoaded) {
        window._ml.q = window._ml.q || [];
        window._ml.q.push(["track"]);
      } else if (!initialPageLoaded) {
        initialPageLoaded = true;
      }
    });
  }, []);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <Loader />;
  }

  // if page not found, throw 404
  if (notFound === true) {
    // Prevent 404 when previewing content items
    if (router.asPath.includes("?ContentID=")) {
      return <Loader />;
    } else {
      return <Error statusCode={404} />;
    }
  }
  const AgilityPageTemplate = getPageTemplate(pageTemplateName);
  if (dynamicPageItem?.seo?.metaDescription) {
    page.seo.metaDescription = dynamicPageItem.seo.metaDescription;
  }
console.log(pageTemplateName)
  return (
    <>
      {page && sitemapNode && (
        <SEO
          title={sitemapNode?.title}
          description={page.seo.metaDescription}
          keywords={page.seo.metaKeywords}
          metaHTML={page.seo.metaHTML}
          url={siteUrl + sitemapNode.path}
        />
      )}
      {isPreview && <p>Loading preview mode...</p>}
      {!isPreview && (
        <>
          <GlobalMessage {...props}></GlobalMessage>
          {pageTemplateName === "BrandTemplate" ? (
            <>  
            <BrandNavbar {...props} />
            <main>
            {children ? children : <AgilityPageTemplate {...props} />}
          </main>
          <BrandFooter/>
          </>
          ) : (
            <>
              <Navbar {...props}></Navbar>
              <main>
                {children ? children : <AgilityPageTemplate {...props} />}
              </main>
              <Footer {...props}></Footer>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Layout;
