import Link from "next/link";
import GenericCard from "../../genericCard/genericCard";
import Heading from "../heading";

// styling for this page module is defined globally because we need to override inner styles from the GenericCard component.

const PressReleaseList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const limit = parseInt(fields.count);
  const articles = fields.highlightedPressReleaseArticles
    ? fields.highlightedPressReleaseArticles
    : fields?.pressReleaseArticles?.slice(0, limit);

  return (
    <section
      className={`section newsList ${fields.classes ? fields.classes : ""}`}
    >
      <nav
        className="container newsList__container"
        aria-label="press release list"
      >
        {heading.text && (
          <div className="heading">
            <Heading {...heading} />
          </div>
        )}
        <div className="newsList__articles">
          {articles?.map((pressReleaseArticle) => (
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
        <Link href="/archives?type=press-releases">
          <a
            className="button cyan outlined newsList--link"
            aria-label="Navigate to page /resources?type=press-releases"
            title="Navigate to page /resources?type=press-releases"
          >
            Read More
          </a>
        </Link>
      </nav>
    </section>
  );
};

export default PressReleaseList;
