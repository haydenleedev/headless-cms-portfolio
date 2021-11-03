import GenericCard from "../../genericCard/genericCard";
import Heading from "../heading";

// styling for this page module is defined globally because we need to override inner styles from the GenericCard component.

const NewsList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const limit = parseInt(fields.count);
  const articles = fields.highlightedNewsArticles
    ? fields.highlightedNewsArticles
    : fields.newsArticles.slice(0, limit);
  return (
    <section className="section newsList">
      <div className="container newsList__container">
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
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsList;
