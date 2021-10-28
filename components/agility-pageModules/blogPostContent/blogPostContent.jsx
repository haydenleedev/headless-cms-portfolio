import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import style from "./blogPostContent.module.scss";
import Subscribe from "../../subscribe/subscribe";
import Link from "next/link";
import BlogPostList from "../blogPostList/blogPostList";

const BlogPostContent = ({ dynamicPageItem, customData }) => {
  const { relatedBlogPosts, sanitizedHtml } = customData;
  const blogPost = dynamicPageItem.fields;
  const dateStr = new Date(blogPost.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // TODO: create a helper function something similar to this to reduce the instrinct pixel size from Agility so
  // we never fetch absurdly large images such as width 3200px etc...

  // if(blogPost.image.pixelWidth > 1080) {
  //   blogPost.image.pixelWidth = blogPost.image.pixelWidth / 2
  //   blogPost.image.pixelHeight = blogPost.image.pixelHeight / 2
  // }
  
  
  //   const ogImageUrl = post.image.url + "?q=50&w=1200&format=auto";
  return (
    <>
      {/* <Head>
        <meta property="og:image" content={ogImageUrl} />
        <meta property="twitter:image" content={ogImageUrl} />
      </Head> */}

      <section className={`section ${style.blogPostContent}`}>
        
        <div className={`container ${style.container}`}>
          <div className={style.body}>
            {/* TODO: populate this once we have the icon assets */}

            <div>
              <h1 className="heading-3">{blogPost.title}</h1>
              <small className={style.meta}>
                {/* TODO: format date */}
                by {blogPost.author?.fields.name || "UJET Team"} | 
                <time dateTime={blogPost.date}>{dateStr}</time>
              </small>
              <AgilityImage
                src={blogPost.image.url}
                alt={blogPost.image.label || null}
                width={blogPost.image.pixelWidth}
                height={blogPost.image.pixelHeight}
                objectFit="cover"
              />
              {/* TODO: Sanitize HTML */}
              <div
                className={`content ${style.content}`}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              />
            </div>
            <div className={style.share}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div>
            <Subscribe></Subscribe>
            <Link href="#">
              <a className={`button outlined cyan ${style.requestDemo}`}>
                Request a DEMO
              </a>
            </Link>
          </div>
        </div>
      </section>
      <BlogPostList
        module={{ fields: { title: "Related Articles" } }}
        overrideClass={style.blogPostList}
        blogPosts={relatedBlogPosts}
      ></BlogPostList>
    </>
  );
};

// function to resole post urls
const resolveAgilityUrls = function (sitemap, posts) {
  let dynamicUrls = {};
  posts.forEach((post) => {
    Object.keys(sitemap).forEach((path) => {
      if (sitemap[path].contentID === post.contentID) {
        dynamicUrls[post.contentID] = path;
      }
    });
  });
  return dynamicUrls;
};

BlogPostContent.getCustomInitialProps = async ({
  agility,
  channelName,
  languageCode,
  dynamicPageItem,
}) => {
  const api = agility;
  try {
    let sitemap = await api.getSitemapFlat({
      channelName: channelName,
      languageCode,
    });

    let raw = await api.getContentList({
      referenceName: "blogposts",
      languageCode,
      contentLinkDepth: 2,
      depth: 2,
      take: 50,
    });

    const dynamicUrls = resolveAgilityUrls(sitemap, raw.items);
    const relatedBlogPosts = raw.items
      // filter self
      .filter((item) => item.contentID !== dynamicPageItem.contentID)
      // filter by category - TODO: not working.....
      // .filter(
      //   item.fields.categories[0].contentID !==
      //     dynamicPageItem.fields.categories[0].contentID
      // )
      // Take 3
      .slice(0, 3)
      .map((post) => {
        const url = dynamicUrls[post.contentID] || "#";
        return {
          ...post,
          url,
        };
      });

    // TODO: Try to move this below to a helper file without breaking the bundle.
    const sanitizeHtml = (await import("sanitize-html")).default;
    // A helper function that checks whether a href is ujet.cx or an external one. Used for sanitizing HTML.
    function hrefSelf(href) {
      return /^(www\.|assets\.|http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(ujet)\.cx?(\/.*)?$/.test(
        href
      );
    }

    // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
    const cleanHtml = (html) =>
      sanitizeHtml(html, {
        allowedAttributes: {
          "*": ["href", "target", "alt", "rel", "class"],
        },
        transformTags: {
          a: function (tagName, attribs) {
            if (!hrefSelf(attribs.href)) {
              attribs.rel = "noindex noreferrer nofollow";
            }
            return {
              tagName: "a",
              attribs,
            };
          },
        },
      });
    const sanitizedHtml = cleanHtml(dynamicPageItem.fields.content);

    return {
      relatedBlogPosts,
      sanitizedHtml,
    };
  } catch (error) {
    if (console) console.error(error);
  }
};

export default BlogPostContent;
