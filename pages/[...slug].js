import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node";
import { getModule } from "../components/agility-pageModules";
import Layout from "../components/layout/layout";
// TODO: import global components
import Navbar from "../components/layout/navbar/navbar";
import Footer from "../components/layout/footer/footer";
import GlobalMessage from "../components/layout/globalMessage/globalMessage";
import GlobalSettings from "../components/layout/globalSettings";
import GlobalContextWrapper from "../context/globalContextWrapper";

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
    globalMessage: GlobalMessage,
    footer: Footer,
    globalSettings: GlobalSettings,
  };

  let agilityProps = await getAgilityPageProps({
    preview,
    params,
    locale,
    getModule,
    defaultLocale,
    globalComponents,
  });

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
  const agilityPaths = await getAgilityPaths({
    preview: false,
    locales,
    defaultLocale,
  });

  // TODO: figure a way to do this
  // need to edit paths for press release pages: they need to be relative to root url, not /press-releases/slug
  /* 
  const otherPaths = agilityPaths.filter(
    (path) => !path.split("/").some((item) => item === "press-releases")
  );

  let pressReleasePaths = agilityPaths
    .filter((path) => path.split("/").some((item) => item === "press-releases"))
    .map((pressReleasePath) => {
      const pathArray = pressReleasePath.split("/");
      const pressReleaseIndex = pathArray.findIndex(
        (item) => item === "press-releases"
      );
      pathArray.splice(pressReleaseIndex, 1);
      return pathArray.join("/");
    }); */

  return {
    paths: agilityPaths,
    fallback: true,
  };
}

const AgilityPage = (props) => {
  return (
    <GlobalContextWrapper>
      <Layout {...props} />
    </GlobalContextWrapper>
  );
};

export default AgilityPage;
