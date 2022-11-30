import dynamic from "next/dynamic";
import style from "./latestCustomerStories.module.scss";
const LatestCustomerStoriesContent = dynamic(
  () => import("./latestCustomerStoriesContent"),
  { ssr: false }
);

const LatestCustomerStories = ({ module, customData }) => {
  const { fields } = module;
  const { customerStories, rootPath } = customData;
  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.latestCustomerStories}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <LatestCustomerStoriesContent
        fields={fields}
        customerStories={customerStories}
        rootPath={rootPath}
      />
    </section>
  );
};

LatestCustomerStories.getCustomInitialProps = async function ({
  agility,
  languageCode,
  sitemapNode,
}) {
  const api = agility;
  const sitemap = await api.getSitemapFlat({
    channelName: "website",
    languageCode: languageCode,
  });
  const customerStoryPageIDs = Object.entries(sitemap)
    .filter(
      ([key, value]) =>
        key.includes(sitemapNode.path) && key !== sitemapNode.path
    )
    .map(([key, value]) => value.pageID);

  let customerStoryPages = customerStoryPageIDs.map((pageID) =>
    api.getPage({
      channelName: "website",
      languageCode: languageCode,
      pageID: pageID,
    })
  );
  customerStoryPages = await Promise.all(customerStoryPages);
  let customerStories = customerStoryPages
    .filter(
      (page) =>
        page.zones.MainContentZone.findIndex(
          (item) => item.module === "CaseStudyData"
        ) !== -1
    )
    .map((page) => {
      return {
        name: page.name,
        ...page.zones.MainContentZone.find(
          (item) => item.module === "CaseStudyData"
        ).item,
      };
    });
  return {
    customerStories,
    rootPath: sitemapNode.path,
  };
};

export default LatestCustomerStories;
