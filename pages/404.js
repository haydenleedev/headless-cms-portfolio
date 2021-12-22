import HeroImage from "../components/agility-pageModules/heroImage/heroImage";
import Layout from "../components/layout/layout";
import agility from "@agility/content-fetch";

const NotFoundPage = ({ globalData }) => {
  console.log(globalData);
  return (
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
          <div className="container">
            <h1 className="heading-4 w-400">Page not found</h1>
            <h2 className="heading-6 w-400 margin-block-1">Error 404</h2>
            <p>
              Sorry, the page you were looking for at this URL was not found.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

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
  console.log(navbarConfig.items);
  return {
    props: {
      globalData: {
        globalMessage: { globalMessage: globalMsg.items[0] },
        navbar: { navbar: navbarConfig.items[0] },
        globalSettings: { data: globalSettings.items[0] },
        footer: { data: footerConfig.items[0] },
      },
    },
  };
};

export default NotFoundPage;
