import dynamic from "next/dynamic";
const Media = dynamic(() => import("../media"));
const AgilityLink = dynamic(() => import("../../agilityLink"));
const Image = dynamic(() => import("next/image"));
import { resolveLink } from "../../../utils/convert";
import style from "./archivesPageContent.module.scss";

const HighlightSection = ({ highlightContent, headingText }) => {
  const isNewsArticle =
    highlightContent.properties.referenceName == "newsarticle";
  const title = isNewsArticle
    ? highlightContent.fields.articleTitle
    : highlightContent.fields.title;
  const newsSite = isNewsArticle ? highlightContent.fields.title : null;
  const link = resolveLink(
    highlightContent.properties.referenceName,
    highlightContent.fields
  );
  return (
    <section className={`section ${style.highlightSection}`}>
      <div className={style.highlightSectionBackgroundImage}>
        {highlightContent.fields?.image ? (
          <Media media={highlightContent.fields?.image} />
        ) : (
          <Image
            src={
              "https://assets.ujet.cx/files/How%20to%20build%20a%20better%20customer%20data%20management%20strategy.jpg"
            }
            data-src={
              "https://assets.ujet.cx/files/How%20to%20build%20a%20better%20customer%20data%20management%20strategy.jpg"
            }
            layout="fill"
          />
        )}
      </div>
      <div className={style.backgroundFilter}></div>
      <div className={`container ${style.highlightSectionContent}`}>
        <h1 className="heading-6 w-400">{headingText}</h1>
        <p className="is-size-4 w-600">
          {newsSite && (
            <span className="is-size-3 w-600 text-skyblue mb-1 p-0">
              {newsSite} <span className="mr-2 ml-2 p-0"> |</span>
            </span>
          )}{" "}
          {title}
        </p>
        <AgilityLink
          agilityLink={link}
          ariaLabel={`Navigate to ${title}`}
          title={title}
        >
          <span className="button mediumblue no-outline">READ MORE</span>
        </AgilityLink>
      </div>
    </section>
  );
};

export default HighlightSection;
