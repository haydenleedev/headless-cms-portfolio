import Link from "next/link";
import GenericCard from "../../genericCard/genericCard";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));

// styling for this page module is defined globally because we need to override inner styles from the GenericCard component.

const NewsList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const limit = parseInt(fields.count);
  const articles = fields.highlightedNewsArticles
    ? fields.highlightedNewsArticles
    : fields.newsArticles.slice(0, limit);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section newsList
      ${mtValue} ${mbValue} ${ptValue} ${pbValue}
       ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <nav className="container newsList__container" aria-label="news list">
        {heading.text && (
          <div className="heading">
            <Heading {...heading} />
          </div>
        )}
        <div className="newsList__articles">
          {articles.map((newsArticle) => (
            <div
              className="newsList__articles__article"
              key={newsArticle.contentID}
            >
              <GenericCard
                date={newsArticle.fields.date}
                link={newsArticle.fields.link}
                description={newsArticle.fields.articleTitle}
                title={newsArticle.fields.title}
                ariaTitle={newsArticle.fields.articleTitle}
              />
            </div>
          ))}
        </div>
        <Link href="/archives?type=news">
          <a
            className="button cyan outlined newsList--link"
            aria-label="Navigate to page /archives?type=news"
            title="Navigate to page /archives?type=news"
          >
            Read More
          </a>
        </Link>
      </nav>
    </section>
  );
};

export default NewsList;
