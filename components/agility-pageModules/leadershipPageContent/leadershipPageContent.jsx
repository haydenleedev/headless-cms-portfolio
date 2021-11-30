import style from "./leadershipPageContent.module.scss";
import Media from "../media";
import { useContext } from "react";
import GlobalContext from "../../../context";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import AgilityLink from "../../agilityLink";

const LeadershipPageContent = ({ customData }) => {
  const { allLeaders } = customData;
  const { handleSetGlobalModal } = useContext(GlobalContext);
  return (
    <section className="section">
      <h1 className=""></h1>
      <div className="container">
        <div className={`grid-columns ${style.leadershipPageContent}`}>
          {allLeaders.map((leader) => (
            <button
              className={`reset-button grid-column is-4 ${style.leader}`}
              key={leader.contentID}
              onClick={() =>
                handleSetGlobalModal(
                  /* need to use global css here */
                  <div className="bio">
                    <aside>
                      <div className="bio--image">
                        <Media media={leader.fields.image} />
                      </div>
                    </aside>
                    <div>
                      <p className="bio--name">{leader.fields.name}</p>
                      <p className="bio--description">
                        {leader.fields.description}
                      </p>
                      <div
                        className="bio--information content"
                        dangerouslySetInnerHTML={renderHTML(
                          leader.fields.information
                        )}
                      ></div>
                      <nav
                        className="bio__social-medias"
                        aria-label={`${leader.fields.name} social media links navigation`}
                      >
                        {leader.fields.socialMedias?.map?.((media) => (
                          <AgilityLink
                            agilityLink={media.fields.link}
                            className="bio__social-medias--media"
                            key={media.contentID}
                          >
                            <Media media={media.fields.image} />
                          </AgilityLink>
                        ))}
                      </nav>
                    </div>
                  </div>
                )
              }
            >
              <div className={style.leaderImage}>
                <Media media={leader.fields.image} />
                <span className={style.leaderImageFilter}></span>
              </div>
              <div>
                <p>{leader.fields.name}</p>
                <p>{leader.fields.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

LeadershipPageContent.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;
  // get total count of  to determine how many calls we need to get all pages
  let initial = await api.getContentList({
    referenceName: "leader",
    languageCode,
    take: 1,
  });

  let totalCount = initial.totalCount;
  let skip = 0;
  let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
    (call) => {
      let pagePromise = api.getContentList({
        referenceName: "leader",
        languageCode,
        sort: "properties.itemOrder",
        direction: "desc",
        expandAllContentLinks: true,
        take: 50, // 50 is max value for take parameter
        skip,
      });
      skip += 50;
      return pagePromise;
    }
  );
  promisedPages = await Promise.all(promisedPages);
  let allLeaders = [];
  promisedPages.map((result) => {
    allLeaders = [...allLeaders, ...result.items];
  });

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  allLeaders = allLeaders.map((leader) => {
    leader.information = cleanHtml(leader.information);
    return leader;
  });

  return { allLeaders };
};

export default LeadershipPageContent;
