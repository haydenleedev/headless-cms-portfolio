import GenericCard from "../../genericCard/genericCard";
import style from "./blogPostList.module.scss";

const BlogPostList = ({ module, overrideClass }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${overrideClass || null /** style.className */}`}
    >
      <div className="container mt">
        {/* TODO: Render according to custom heading field definition */}
        <h6>{fields.title}</h6>

        <div className={style.cards}>
          <GenericCard title="Insert title here"></GenericCard>
          <GenericCard title="Insert title here"></GenericCard>
          <GenericCard title="Insert title here"></GenericCard>
        </div>
      </div>
    </section>
  );
};

export default BlogPostList;
