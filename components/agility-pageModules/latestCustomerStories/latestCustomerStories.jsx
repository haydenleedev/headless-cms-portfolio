import Media from "../media";
import Heading from "../heading";
import { boolean } from "../../../utils/validation";
import style from "./latestCustomerStories.module.scss";
import { useRouter } from "next/router";

const LatestCustomerStories = ({ module, customData }) => {
  const router = useRouter();
  const { fields } = module;
  const { customerStories } = customData;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const cardStyle = boolean(fields.cardStyle);
  const count = parseInt(fields.count);
  const stories =
    router.query?.slug.length === 2 &&
    router.query?.slug[0] === "customerstories"
      ? customerStories
          .filter((story) => story.fields.link.text !== router.query.slug[1])
          .slice(0, count)
      : customerStories.slice(0, count);
  return (
    <section className={`section ${style.latestCustomerStories}`}>
      <div className="container">
        {heading && (
          <div className={style.heading}>
            <Heading {...heading} />
          </div>
        )}
        <nav className={style.content} aria-label="customer stories navigation">
          {stories.map((story) => (
            <div className={style.story}>
              <div className={style.storyImage}>
                <Media media={story.fields.image} />
              </div>
              <h3 className={style.storyTitle}>{story.fields.customer}</h3>
              <p className={style.storyDescription}>
                {story.fields.description}
              </p>
              <p>{story.fields.link.text}</p>
            </div>
          ))}
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
