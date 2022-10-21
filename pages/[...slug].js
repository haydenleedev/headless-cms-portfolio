import React, { useEffect, useContext } from "react";
import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node";
import { getModule } from "../components/agility-pageModules";
import agility from "@agility/content-fetch";
import Layout from "../components/layout/layout";
import Navbar from "../components/layout/navbar/navbar";
import BrandNavbar from "../components/layout/brandNavbar/brandNavbar";
import Footer from "../components/layout/footer/footer";
import GlobalMessage from "../components/layout/globalMessage/globalMessage";
import GlobalSettings from "../components/layout/globalSettings";
import GlobalContext from "../context";

// getStaticProps function fetches data for all of your Agility Pages and Next.js will pre-render these pages at build time
export async function getStaticProps({
  preview,
  params,
  locale,
  defaultLocale,
  locales,
}) {

  const api = await agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
    isPreview: false,
  });

  const globalComponents = {
    navbar: Navbar,
    brandNavbar: BrandNavbar,
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

  return {
    paths: agilityPaths,
    fallback: false,
  };
}

const AgilityPage = (props) => {
  const { handleSetGlobalSettings } = useContext(GlobalContext);
  useEffect(() => {
    handleSetGlobalSettings(props.globalData.globalSettings.data);
  }, []);
  return <Layout {...props} />;
};

export default AgilityPage;
