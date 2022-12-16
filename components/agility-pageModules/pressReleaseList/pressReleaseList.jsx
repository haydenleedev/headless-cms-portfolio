import Link from "next/link";
import GenericCard from "../../genericCard/genericCard";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));

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
      className={`section newsList ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
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
                  link={{
                    href: "/press-releases/" + pressReleaseArticle.fields.slug,
                  }}
                  description={pressReleaseArticle.fields.title}
                  title="Press Release"
                  ariaTitle={pressReleaseArticle.fields.title}
                />
              }
            </div>
          ))}
        </div>
        <Link href="/archives?type=pressreleases">
          <a
            className="button cyan outlined newsList--link"
            aria-label="Navigate to page /archives?type=pressreleases"
            title="Navigate to page /archives?type=pressreleases"
          >
            Read More
          </a>
        </Link>
      </nav>
    </section>
  );
};

export default PressReleaseList;
