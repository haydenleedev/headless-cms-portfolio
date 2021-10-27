import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node";
import { getModule } from "../components/agility-pageModules";
import Layout from "../components/layout/layout";
// TODO: import global components
import Navbar from "../components/layout/navbar/navbar";
import { cleanHtml } from "../utils/validation";
// getStaticProps function fetches data for all of your Agility Pages and Next.js will pre-render these pages at build time
export async function getStaticProps({
  preview,
  params,
  locale,
  defaultLocale,
  locales,
}) {
  // TODO: place all global here
  const globalComponents = {
    navbar: Navbar,
  };

  let agilityProps = await getAgilityPageProps({
    preview,
    params,
    locale,
    getModule,
    defaultLocale,
    globalComponents,
  });

  //  IGNORE BELOW
  // for (const [key, value] of Object.entries(agilityProps)) {
  //   if(key === "page") {
  //     switch(value.name) {
  //       case "blog-posts":
  //         console.log(value.zones.MainContentZone[0].item);
  //         break;
  //       default:
  //         console.log("default")
  //     }
  //   }
  // }

  if (!agilityProps) {
    // We throw to make sure this fails at build time as this is never expected to happen
    throw new Error(`Page not found`);
  }
  return {
    props: agilityProps,
    // Next.js will attempt to re-generate the page when a request comes in, at most once every 10 seconds
    // Read more on Incremental Static Regenertion here: https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
    revalidate: 10,
  };
}

// Next.js will statically pre-render all the paths from Agility CMS
export async function getStaticPaths({ locales, defaultLocale }) {
  //get the paths configured in agility
  let agilityPaths = await getAgilityPaths({
    preview: false,
    locales,
    defaultLocale,
  });

  return {
    paths: agilityPaths,
    fallback: true,
  };
}

const AgilityPage = (props) => {
  return <Layout {...props} />;
};

export default AgilityPage;
