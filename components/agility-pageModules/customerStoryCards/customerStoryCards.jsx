import style from "./customerStoryCards.module.scss";
import CustomerStoryCardsContent from "./customerStoryCardsContent";

const CustomerStoryCards = ({ module, customData }) => {
  const { fields } = module;
  const card1Data = customData?.card1Data;
  const card2Data = customData?.card2Data;
  const card3Data = customData?.card3Data;
  const rootPath = customData?.rootPath;
  const customerStories = [card1Data, card2Data, card3Data];
  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";
  return (
    <section
      className={`section ${style.customerStoryCards} 
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
    >
      <CustomerStoryCardsContent
        fields={fields}
        customerStories={customerStories}
        rootPath={rootPath}
      />
    </section>
  );
};

CustomerStoryCards.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
  sitemapNode,
}) {
  const api = agility;
  const sitemap = await api.getSitemapFlat({
    channelName: "website",
    languageCode: languageCode,
  });
  let rootPath = sitemapNode.path.split("/");
  rootPath.pop();
  rootPath = rootPath.join("/");
  const customerStoryPageIDs = Object.entries(sitemap)
    .filter(([key, value]) => key.includes(rootPath) && key !== rootPath)
    .map(([key, value]) => {
      return {
        path: key,
        pageID: value.pageID,
      };
    });

  let customerStoryPages = customerStoryPageIDs.map((item) =>
    api.getPage({
      channelName: "website",
      languageCode: languageCode,
      pageID: item.pageID,
    })
  );
  customerStoryPages = await Promise.all(customerStoryPages);
  customerStoryPages = customerStoryPages.filter(
    (page) =>
      page && page.zones.MainContentZone.findIndex(
        (item) => item.module === "CaseStudyData" || item.module === "FirstFold"
      ) !== -1
  );
  customerStoryPages = customerStoryPages.map((page) => {
    let name = customerStoryPageIDs
      .find((item) => item.pageID === page.pageID)
      .path.split("/")
      .pop();
    return { ...page, name };
  });
  const card1Page = customerStoryPages.find((page) =>
    item.fields.card1.href.includes(page.name)
  );
  const card1Data = {
    name: card1Page.name,
    ...card1Page?.zones?.MainContentZone?.find?.(
      (module) => module.module === "CaseStudyData" || module.module === "FirstFold"
    )?.item,
  };
  const card2Page = customerStoryPages.find((page) =>
    item.fields.card2.href.includes(page.name)
  );
  const card2Data = {
    name: card2Page.name,
    ...card2Page?.zones?.MainContentZone?.find?.(
      (module) => module.module === "CaseStudyData" || module.module === "FirstFold"
    )?.item,
  };
  const card3Page = customerStoryPages.find((page) =>
    item.fields.card3.href.includes(page.name)
  );
  const card3Data = {
    name: card3Page.name,
    ...card3Page?.zones?.MainContentZone?.find?.(
      (module) => module.module === "CaseStudyData" || module.module === "FirstFold"
    )?.item,
  };
  return { card1Data, card2Data, card3Data, rootPath };
};

export default CustomerStoryCards;
