import Link from "next/link";
import { boolean } from "../../../utils/validation";
import GenericCard from "../../genericCard/genericCard";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: true });

// styling for this page module is defined globally because we need to override inner styles from the GenericCard component.

const BlogPostList = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const limit = parseInt(fields.count);
  const hideMainLink = boolean(fields.hideMainLink);
  const articles = fields.highlightedBlogPosts
    ? fields.highlightedBlogPosts
    : fields?.blogPosts?.slice(0, limit);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section newsList ${mtValue} ${mbValue} ${ptValue} ${pbValue}
      ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <nav
        className="container newsList__container"
        aria-label="press release list"
      >
        {heading && (
          <div className="heading">
            <Heading {...heading} />
          </div>
        )}
        <div className="newsList__articles">
          {articles?.map((blogPost) => (
            <div
              className="newsList__articles__article"
              key={blogPost.contentID}
            >
              {
                <GenericCard
                  date={blogPost.fields.date}
                  link={{ href: "/blog/" + blogPost.fields.slug }}
                  description={blogPost.fields.title}
                  image={blogPost.fields.image}
                  title="Blog"
                  ariaTitle={blogPost.fields.title}
                />
              }
            </div>
          ))}
        </div>
        {!hideMainLink && (
          <Link href="/blog">
            <a
              className="button cyan outlined newsList--link"
              aria-label="Navigate to the blog page"
              title="Navigate to the blog page"
            >
              Read More
            </a>
          </Link>
        )}
      </nav>
    </section>
  );
};

export default BlogPostList;
