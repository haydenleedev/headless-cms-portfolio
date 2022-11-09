import dynamic from "next/dynamic";
import style from "./awardsPageContent.module.scss";
const Media = dynamic(() => import("../media"), { ssr: false });
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });

const AwardsPageContent = ({ customData }) => {
  const { allAwards } = customData;
  return (
    <section className="section">
      <div className="container">
        <nav className={style.awardsPageContent} aria-label="awards navigation">
          {allAwards.map((award) => {
            if (!award.fields.hideOnAwardsPage)
              return (
                <div className={style.award} key={award.contentID}>
                  <div className={style.awardImage}>
                    <Media media={award.fields.image} />
                  </div>
                  <div>
                    <p>{award.fields.title}</p>
                    {award.fields.year && <small>{award.fields.year}</small>}
                    {award.fields.link && (
                      <AgilityLink
                        agilityLink={award.fields.link}
                        className={style.awardLink}
                      >
                        <span>Learn More</span>
                      </AgilityLink>
                    )}
                  </div>
                </div>
              );
          })}
        </nav>
      </div>
    </section>
  );
};

AwardsPageContent.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;
  // get total count of  to determine how many calls we need to get all pages
  let initial = await api.getContentList({
    referenceName: "awards",
    languageCode,
    take: 1,
  });

  let totalCount = initial.totalCount;
  let skip = 0;
  let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
    (call) => {
      let pagePromise = api.getContentList({
        referenceName: "awards",
        languageCode,
        sort: "properties.itemOrder",
        direction: "desc",
        take: 50, // 50 is max value for take parameter
        skip,
      });
      skip += 50;
      return pagePromise;
    }
  );
  promisedPages = await Promise.all(promisedPages);
  let allAwards = [];
  promisedPages.map((result) => {
    allAwards = [...allAwards, ...result.items];
  });

  return { allAwards };
};

export default AwardsPageContent;
