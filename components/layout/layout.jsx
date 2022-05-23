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
import ScrollToTop from "../scrollToTop/scrollToTop";
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


  // HOTFIX DUE TO VERCEL MIDDLEWARE FAILING FOR AN UNKNOWN REASON !

  // Temporary front-end redirect since _middleware.js on Vercel stopped working...
  if (typeof window !== "undefined" && window.location.href) {
    const url = window.location.href;
    console.log(url);

    const uppercaseRedirects = [
      "https://ujet.cx/archive/01June2019-website-privacy-notice",
      "https://ujet.cx/archive/01June2019-privacy-notice",
      "https://ujet.cx/archive/policy-prior-to-01-June-2019",
      "https://ujet.cx/CER",
    ];

    // Redirect uppercase urls to lowercase based on the array above
    if (uppercaseRedirects.includes(url)) {
      router.replace(url.toLowerCase());
    }

    // Redirect blog.ujet.co
    const blogUrl = "blog.ujet.co";
    const blogUrlRegex = new RegExp(`/(${blogUrl})/`);

    if (url.includes(blogUrl)) {
      const postSlug = url.replace(/en-US/g, "").split(blogUrlRegex)[2];
      const redirectUrl = "https://ujet.cx/blog";
      if (postSlug) {
        router.replace(`${redirectUrl}/${postSlug}`);
      }
      router.replace(redirectUrl);
    }
    //Redirect brand.ujet.cx
    const brandUrl = "brand.ujet.cx";
    const brandUrlRegex = new RegExp(`/(${brandUrl})/`);
    if (url.includes(brandUrl)){
      const pageSlug = url.split(blogUrlRegex)[2];
      const redirectUrl = "https://ujet.cx/brand";
      if (pageSlug){
        router.replace(`${redirectUrl}/${pageSlug}`);
      }
      router.replace(redirectUrl);
    }
    //Redirect buy.ujet.cx
    const buyUrl = "buy.ujet.cx";
    if (url.includes(buyUrl)) {
      const redirectUrl = "https://ujet.cx/shop";
      router.replace(redirectUrl);
    }
  }
  // END OF HOTFIX


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
            <main className="brand">
              <ScrollToTop />
            {children ? children : <AgilityPageTemplate {...props} />}
          </main>
          <BrandFooter {...props} />
          </>
          ) : (
            <>
         <Navbar {...props}></Navbar>
          <main>{children ? children : <AgilityPageTemplate {...props} />}</main>
          <Footer {...props}></Footer>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Layout;
