import HeroImage from "../components/agility-pageModules/heroImage/heroImage";
import Layout from "../components/layout/layout";
import agility from "@agility/content-fetch";
import Head from "next/head";

const NotFoundPage = ({ globalData }) => {
  return (
    <>
      <Head>
        <title>{globalData.fourOhFour.data.fields.metaTitle}</title>
      </Head>
      <Layout globalData={globalData}>
        <div className="notFoundPage">
          <HeroImage
            module={{
              fields: {
                image: {
                  url: "https://assets.ujet.cx/404.png",
                  pixelHeight: "200",
                  pixelWidth: "1920",
                },
              },
            }}
            narrowHeight
          />
          <section className="section">
            <div
              className="container"
              dangerouslySetInnerHTML={{ __html: globalData.fourOhFour.data.fields.text }}
            ></div>
          </section>
        </div>
      </Layout>
    </>
  );
};

// because this page is created in the pages folder (not in agility), we need to fetch the global data from agility for the layout component on build time
export const getStaticProps = async () => {
  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
    isPreview: false,
  });
  const footerConfig = await api.getContentList({
    referenceName: "footerconfiguration",
    languageCode: "en-us",
    expandAllContentLinks: true,

    contentLinkDepth: 5,
  });
  const globalMsg = await api.getContentList({
    referenceName: "globalmessage",
    languageCode: "en-us",
    expandAllContentLinks: true,
  });
  const globalSettings = await api.getContentList({
    referenceName: "globalsettings",
    languageCode: "en-us",
    expandAllContentLinks: true,
    contentLinkDepth: 5,
  });
  const navbarConfig = await api.getContentList({
    referenceName: "navbarconfiguration",
    languageCode: "en-us",
    expandAllContentLinks: true,
    contentLinkDepth: 6,
  });
  const fourOhFourConfig = await api.getContentList({
    referenceName: "fourohfour",
    languageCode: "en-us",
    expandAllContentLinks: true,
    contentLinkDepth: 6,
  });
  return {
    props: {
      globalData: {
        globalMessage: { globalMessage: globalMsg.items[0] },
        navbar: { navbar: navbarConfig.items[0] },
        globalSettings: { data: globalSettings.items[0] },
        footer: { data: footerConfig.items[0] },
        fourOhFour: { data: fourOhFourConfig.items[0] },
      },
    },
  };
};

export default NotFoundPage;
