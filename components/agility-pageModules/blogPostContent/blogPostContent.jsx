import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import style from "./blogPostContent.module.scss";
import Subscribe from "../../subscribe/subscribe";
import Link from "next/link";
import BlogPostList from "../blogPostList/blogPostList";

const BlogPostContent = ({ dynamicPageItem }) => {
  const blogPost = dynamicPageItem.fields;
  console.log(blogPost);
  // const dateStr = new Date(post.date).toLocaleDateString();
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
            {/* TODO: populate this once we have the icon assets */}
            <div className={style.share}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h1 className="heading-3">{blogPost.title}</h1>
            <small className={style.meta}>
              by {"Author"} | <time dateTime="2011-11-11">Date here</time>
            </small>
            <AgilityImage
              src={blogPost.image.url}
              alt={blogPost.image.label}
              width={blogPost.image.pixelWidth}
              height={blogPost.image.pixelHeight}
            />
            <div
              className={style.content}
              dangerouslySetInnerHTML={renderHTML(blogPost.content)}
            />
          </div>
          <div>
            <Subscribe></Subscribe>
            <Link href="#">
              <a className={`button outlined cyan ${style.requestDemo}`}>
                Requst a DEMO
              </a>
            </Link>
          </div>
        </div>
      </section>
      <BlogPostList
        module={{ fields: { title: "Related Articles" } }}
        overrideClass={style.blogPostList}
      ></BlogPostList>
    </>
  );
};

export default BlogPostContent;
