import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import style from "./blogPostContent.module.scss";
import Subscribe from "../../subscribe/subscribe";
import Link from "next/link";
import BlogPostList from "../blogPostList/blogPostList";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article, blogPosting } from "../../../schema";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";

const BlogPostContent = ({ dynamicPageItem, customData }) => {
  const { relatedBlogPosts, sanitizedHtml } = customData;
  const blogPost = dynamicPageItem.fields;
  const url = process.env.NEXT_PUBLIC_SITE_URL + "/blog/" + blogPost.slug;
  const dateStr = new Date(blogPost.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleText = sanitizedHtml.replace(/<[^>]+>/g, "");

  // trick for getting non-duplicate keywords out from blog post categories
  const keywords = Array.from(
    new Set(
      [
        ...blogPost.categories.map((category) => {
          return category.fields.title.toLowerCase();
        }),
      ]
        .join(" ")
        .split(" ")
    )
  ).join(" ");

  const ShareTwitter = () => (
    <a
      href={"https://twitter.com/intent/tweet?url=" + url}
      target="_blank"
      rel="noindex noreferrer nofollow"
      aria-label="Share in Twitter"
      title="Share in Twitter"
    >
      <span className={style.shareIcon}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <g>
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </g>
        </svg>
      </span>
    </a>
  );

  const ShareFacebook = () => (
    <a
      href={"https://www.facebook.com/sharer/sharer.php?u=" + url}
      target="_blank"
      rel="noindex noreferrer nofollow"
      aria-label="Share in Facebook"
      title="Share in Facebook"
    >
      <span className={style.shareIcon}>
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          width="1298"
          height="2500"
          viewBox="88.428 12.828 107.543 207.085"
        >
          <path
            d="M158.232 219.912v-94.461h31.707l4.747-36.813h-36.454V65.134c0-10.658 2.96-17.922 18.245-17.922l19.494-.009V14.278c-3.373-.447-14.944-1.449-28.406-1.449-28.106 0-47.348 17.155-47.348 48.661v27.149H88.428v36.813h31.788v94.461l38.016-.001z"
            fill="#3c5a9a"
          />
        </svg>
      </span>
    </a>
  );
  const ShareLinkedin = () => (
    <a
      href={"https://www.linkedin.com/sharing/share-offsite/?url=" + url}
      target="_blank"
      rel="noindex noreferrer nofollow"
      aria-label="Share in Linkedin"
      title="Share in Linkedin"
    >
      <span className={style.shareIcon}>
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          width="2500"
          height="2389"
          viewBox="0 5 1036 990"
        >
          <path d="M0 120c0-33.334 11.667-60.834 35-82.5C58.333 15.833 88.667 5 126 5c36.667 0 66.333 10.666 89 32 23.333 22 35 50.666 35 86 0 32-11.333 58.666-34 80-23.333 22-54 33-92 33h-1c-36.667 0-66.333-11-89-33S0 153.333 0 120zm13 875V327h222v668H13zm345 0h222V622c0-23.334 2.667-41.334 8-54 9.333-22.667 23.5-41.834 42.5-57.5 19-15.667 42.833-23.5 71.5-23.5 74.667 0 112 50.333 112 151v357h222V612c0-98.667-23.333-173.5-70-224.5S857.667 311 781 311c-86 0-153 37-201 111v2h-1l1-2v-95H358c1.333 21.333 2 87.666 2 199 0 111.333-.667 267.666-2 469z" />
        </svg>
      </span>
    </a>
  );

  const ShareEmail = () => (
    <a
      target="_blank"
      rel="noindex noreferrer nofollow"
      aria-label="Share by email"
      title="Share by email"
      href={
        "mailto:?subject=I wanted you to see this blog post by UJET&amp;body=Check out this article: " +
        url
      }
    >
      <span className={style.shareIcon}>
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="38"
          viewBox="0 0 56 38"
          fill="none"
        >
          <path
            d="M0 3C0 1.34315 1.34315 0 3 0H53C54.6569 0 56 1.34315 56 3V7.56826C56 8.74469 55.3124 9.81255 54.2414 10.2994L29.7196 21.4457C28.9435 21.7984 28.0539 21.8043 27.2732 21.4619L1.79502 10.2873C0.704412 9.80895 0 8.73081 0 7.53992V3Z"
            fill="white"
          />
          <path
            d="M0 17.6325C0 15.4574 2.24236 14.0052 4.22717 14.8949L27.7277 25.4296C28.5345 25.7913 29.4597 25.7787 30.2563 25.3951L51.6015 15.1178C53.6169 14.1474 55.9471 15.6444 55.9024 17.8808L55.5588 35.06C55.5261 36.6931 54.1929 38 52.5594 38H3C1.34315 38 0 36.6569 0 35V17.6325Z"
            fill="white"
          />
        </svg>
      </span>
    </a>
  );

  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: blogPost.title,
            image: blogPost?.image?.url,
            keywords,
            wordcount: articleText.split(" ").length,
            url,
            datePublished: blogPost.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: blogPost.date,
            description: blogPost.metaDescription,
            articleBody: articleText,
          }),
          blogPosting({
            headline: blogPost.title,
            image: blogPost?.image?.url,
            keywords,
            wordcount: articleText.split(" ").length,
            url,
            datePublished: blogPost.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: blogPost.date,
            description: blogPost.metaDescription,
            articleBody: articleText,
            authorName: blogPost.author?.fields.name || "UJET Team",
          }),
        ]}
      />
      <Breadcrumbs breadcrumbs={
          [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: blogPost.title }
          ]
        }
      />
      <section className={`section ${style.blogPostContent}`}>
        <div className={`container ${style.container}`}>
          <div className={style.body}>
            <div>
              <h1 className="heading-4">{blogPost.title}</h1>
              <small className={style.meta}>
                by {blogPost.author?.fields.name || "UJET Team"} | 
                <time dateTime={blogPost.date}>{dateStr}</time>
              </small>
              {blogPost.image && (
                <div className={style.blogPostImage}>
                    <AgilityImage
                      src={blogPost.image.url}
                      alt={blogPost.image.label || null}
                      width={blogPost.image.pixelWidth}
                      height={blogPost.image.pixelHeight}
                      objectFit="cover"
                      layout="responsive"
                    />
                </div>
              )}
              <article
                className={`content ${style.content}`}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              />
            </div>
            <div className={style.share}>
              <ShareTwitter />
              <ShareLinkedin />
              <ShareFacebook />
              <ShareEmail />
            </div>
          </div>
          <div>
            <Subscribe></Subscribe>
            <Link href="/request-a-demo">
              <a
                className={`button outlined cyan ${style.requestDemo}`}
                aria-label="Navigate to 'Request a Demo' page"
              >
                Request a DEMO
              </a>
            </Link>
          </div>
        </div>
      </section>
      <BlogPostList
        module={{
          fields: {
            title: "Related Articles",
            highlightedBlogPosts: relatedBlogPosts,
          },
        }}
        overrideClass={style.blogPostList}
        blogPosts={relatedBlogPosts}
      ></BlogPostList>
    </>
  );
};

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

    const sanitizeHtml = (await import("sanitize-html")).default;

    // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
    const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

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
