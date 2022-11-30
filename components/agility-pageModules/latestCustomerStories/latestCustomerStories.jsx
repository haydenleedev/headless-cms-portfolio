import dynamic from "next/dynamic";
import style from "./latestCustomerStories.module.scss";
const LatestCustomerStoriesContent = dynamic(
  () => import("./latestCustomerStoriesContent"),
  { ssr: false }
);

const LatestCustomerStories = ({ module, customData }) => {
  const { fields } = module;
  const { customerStories, rootPageName } = customData;
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
        rootPageName={rootPageName}
      />
    </section>
  );
};

LatestCustomerStories.getCustomInitialProps = async function ({
  agility,
  languageCode,
  page,
}) {
  const api = agility;
  const sitemap = await api.getSitemapFlat({
    channelName: "website",
    languageCode: languageCode,
  });
  const customerStoryPageIDs = Object.entries(sitemap)
    .filter(
      ([key, value]) => key.includes(`/${page.name}`) && key !== `/${page.name}`
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
    rootPageName: page.name,
  };
};

export default LatestCustomerStories;
