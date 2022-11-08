import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
import style from "./latestCustomerStories.module.scss";
import GenericCard from "../../genericCard/genericCard";
import { Fragment, useState } from "react";

const LatestCustomerStories = ({ module, customData }) => {
  const { fields } = module;
  const { customerStories } = customData;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  const [amountOfPostsToShow, setAmountOfPostsToShow] = useState(3);

  return (
    <section
      className={`section ${style.latestCustomerStories}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        {heading && (
          <div className={`${style.heading} align-center mb-3`}>
            <Heading {...heading} />
          </div>
        )}
        <nav
          className={`columns repeat-3 ${style.content}`}
          aria-label="customer customerStories navigation"
        >
          {customerStories.map((story, i) => {
            return (
              i + 1 <= amountOfPostsToShow && (
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
              )
            );
          })}
        </nav>
        {amountOfPostsToShow < customerStories.length && (
          <button
            className={`button orange ${style.loadMoreButton}`}
            onClick={(e) => {
              e.stopPropagation();
              setAmountOfPostsToShow(amountOfPostsToShow + 3);
            }}
          >
            View More Customer Stories
          </button>
        )}
      </div>
    </section>
  );
};

LatestCustomerStories.getCustomInitialProps = async function ({
  agility,
  languageCode,
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
    .map(
      (page) =>
        page.zones.MainContentZone.find(
          (item) => item.module === "CaseStudyData"
        ).item
    );
  return {
    customerStories,
  };
};

export default LatestCustomerStories;
