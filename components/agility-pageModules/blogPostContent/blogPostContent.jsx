import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import style from "./blogPostContent.module.scss";
import Subscribe from "../../subscribe/subscribe";

const BlogPostContent = ({ dynamicPageItem }) => {
  const blogPost = dynamicPageItem.fields;
  console.log(blogPost);
  //   const dateStr = new Date(post.date).toLocaleDateString();
  //   const ogImageUrl = post.image.url + "?q=50&w=1200&format=auto";
  return (
    <>
      {/* <Head>
        <meta property="og:image" content={ogImageUrl} />
        <meta property="twitter:image" content={ogImageUrl} />
      </Head> */}

      <section className={`section ${style.blogPostContent}`}>
        <div className={`container ${style.container}`}>
          <div>
            <h1 className="heading-3">{blogPost.title}</h1>
            <div dangerouslySetInnerHTML={renderHTML(blogPost.content)} />
          </div>
          <div className={style.share}>Share</div>
          <Subscribe></Subscribe>
        </div>
        <div className="container mt">
          <p>Render related posts here (Create a component)</p>
        </div>
      </section>
    </>
  );
};

export default BlogPostContent;
