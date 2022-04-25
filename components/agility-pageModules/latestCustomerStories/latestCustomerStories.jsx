import Media from "../media";
import Heading from "../heading";
import { boolean } from "../../../utils/validation";
import style from "./latestCustomerStories.module.scss";
import { useRouter } from "next/router";
import AgilityLink from "../../agilityLink";
import GenericCard from "../../genericCard/genericCard";
import { Fragment } from "react";

const LatestCustomerStories = ({ module, customData }) => {
  const router = useRouter();
  const { fields } = module;
  const { customerStories } = customData;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const cardStyle = boolean(fields.cardStyle);
  const count = fields.count ? parseInt(fields?.count) : undefined;

  // we don't want to recommend the same article that is currently being viewed
  const stories =
    router.query?.slug.length === 2 &&
    router.query?.slug[0] === "customerstories"
      ? customerStories
          .filter(
            (story) =>
              story.fields.link.href !== "/" + router.query.slug.join("/")
          )
          .slice(0, count)
      : customerStories.slice(0, count);

  return (
    <section
      className={`section ${style.latestCustomerStories}`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        {heading && (
          <div
            className={`${style.heading} ${
              cardStyle ? "align-center mb-5" : ""
            }`}
          >
            <Heading {...heading} />
          </div>
        )}
        <nav
          className={`columns repeat-3 ${style.content}`}
          aria-label="customer stories navigation"
        >
          {stories.map((story) => {
            const heading = JSON.parse(story.fields.heading);
            return (
              <Fragment key={story.contentID}>
                {cardStyle ? (
                  <GenericCard
                    link={story.fields.link}
                    image={story.fields.image}
                    title={heading.text}
                    ariaTitle={`${heading.text} customer story`}
                    description={story.fields.description}
                  />
                ) : (
                  <AgilityLink
                    agilityLink={story.fields.link}
                  >
                    <div className={style.story}>
                      <div>
                        <div className={style.storyImage}>
                          <Media
                            media={story.fields.image}
                          />
                        </div>
                        <div className={style.storyTitle}>
                          <Heading {...heading} />
                        </div>
                        <p className={style.storyDescription}>
                          {story.fields.description}
                        </p>
                      </div>
                      <div className="d-flex align-items-center justify-content-flex-start">
                        <p className={style.storyLink}>
                          {story.fields.link.text}
                        </p>
                      </div>
                    </div>
                  </AgilityLink>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

LatestCustomerStories.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;
  const referenceName = "customerStory";
  // get total count of  to determine how many calls we need to get all pages
  let initial = await api.getContentList({
    referenceName,
    languageCode,
    take: 1,
  });

  let totalCount = initial.totalCount;
  let skip = 0;
  let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
    (call) => {
      let pagePromise = api.getContentList({
        referenceName,
        languageCode,
        take: 50, // 50 is max value for take parameter
        skip,
        sort: "properties.itemOrder",
      });
      skip += 50;
      return pagePromise;
    }
  );
  promisedPages = await Promise.all(promisedPages);
  let customerStories = [];
  promisedPages.map((result) => {
    customerStories = [...customerStories, ...result.items];
  });
  return {
    customerStories,
  };
};

export default LatestCustomerStories;
