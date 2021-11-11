import GenericCard from "../../genericCard/genericCard";
import style from "./blogPostList.module.scss";

const BlogPostList = ({ module, overrideClass, blogPosts }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${overrideClass || null /** style.className */}`}
    >
      <nav className="container mt-4" aria-label="blog post list">
        {/* TODO: Render according to custom heading field definition */}
        <h6>{fields.title}</h6>
        <div className={style.cards}>
          {blogPosts.map((blogPost) => (
            <GenericCard
              key={blogPost.contentID}
              title={blogPost.fields.title}
              link={{ href: blogPost.url }}
              image={blogPost.fields.image}
            ></GenericCard>
          ))}
        </div>
      </nav>
    </section>
  );
};

export default BlogPostList;
