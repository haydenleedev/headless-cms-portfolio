import { Fragment } from "react";
import GenericCard from "../../genericCard/genericCard";
import style from "./customerStoryCards.module.scss";

const CustomerStoryCards = ({ module, customData }) => {
  const { fields } = module;
  const { card1Data, card2Data, card3Data } = customData;
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
      <div className={`container ${style.content}`}>
        <div className={`${style.heading} align-center mb-4`}>
          <h2 className="heading-4">{fields.title}</h2>
        </div>
        <nav
          className={`columns repeat-3 ${style.cards}`}
          aria-label="customer customerStories navigation"
        >
          {customerStories.map((story) => {
            return (
              <Fragment key={story.contentID}>
                <GenericCard
                  link={story.fields.link}
                  image={story.fields.image}
                  title={story.fields.title}
                  ariaTitle={`${story.fields.title} customer story`}
                  description={story.fields.description}
                  configuration={{
                    imageHeight: "tall",
                    emphasizedTitle: true,
                  }}
                />
              </Fragment>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

CustomerStoryCards.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;
  const sitemap = await api.getSitemapFlat({
    channelName: "website",
    languageCode: languageCode,
  });
  const customerStoryPageIDs = Object.entries(sitemap)
    .filter(
      ([key, value]) =>
        key.includes("/customerstories") && key !== "/customerstories"
    )
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
  customerStoryPages = customerStoryPages.map((page) => {
    const path = customerStoryPageIDs.find(
      (item) => item.pageID === page.pageID
    ).path;
    return { ...page, path };
  });
  const card1Data = customerStoryPages
    .find((page) => item.fields.card1.href.includes(page.path))
    ?.zones?.MainContentZone?.find?.(
      (module) => module.module === "CaseStudyData"
    )?.item;
  const card2Data = customerStoryPages
    .find((page) => item.fields.card2.href.includes(page.path))
    ?.zones?.MainContentZone?.find?.(
      (module) => module.module === "CaseStudyData"
    )?.item;
  const card3Data = customerStoryPages
    .find((page) => item.fields.card3.href.includes(page.path))
    ?.zones?.MainContentZone?.find?.(
      (module) => module.module === "CaseStudyData"
    )?.item;
  return { card1Data, card2Data, card3Data };
};

export default CustomerStoryCards;
