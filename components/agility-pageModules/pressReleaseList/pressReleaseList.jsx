import GenericCard from "../../genericCard/genericCard";
import Heading from "../heading";

// styling for this page module is defined globally because we need to override inner styles from the GenericCard component.

const PressReleaseList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const limit = parseInt(fields.count);
  const articles = fields.highlightedPressReleaseArticles
    ? fields.highlightedPressReleaseArticles
    : fields.pressReleaseArticles.slice(0, limit);
  console.log(fields.pressReleaseArticles);
  return (
    <section className="section newsList">
      <div className="container newsList__container">
        {heading.text && (
          <div className="heading">
            <Heading {...heading} />
          </div>
        )}
        <div className="newsList__articles">
          {articles.map((pressReleaseArticle) => (
            <div
              className="newsList__articles__article"
              key={pressReleaseArticle.contentID}
            >
              {
                <GenericCard
                  date={pressReleaseArticle.fields.date}
                  link={{ href: pressReleaseArticle.fields.slug }}
                  description={pressReleaseArticle.fields.title}
                  title="Press Release"
                />
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressReleaseList;
