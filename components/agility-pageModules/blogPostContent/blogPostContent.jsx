import { renderHTML } from "@agility/nextjs";
import dynamic from "next/dynamic";
import { AgilityImage } from "@agility/nextjs";
import style from "./blogPostContent.module.scss";
import TextWithMedia from "../textWithMedia/textWithMedia";
import {
  convertUJETLinksToHttps,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article, blogPosting } from "../../../schema";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";
const ShareSocials = dynamic(() => import("./shareSocials"));
const AgilityLink = dynamic(() => import("../../agilityLink"));
const Media = dynamic(() => import("../media"));
const Subscribe = dynamic(() => import("../../subscribe/subscribe"));
const BlogPostList = dynamic(() => import("../blogPostList/blogPostList"));

const BlogPostContent = ({ dynamicPageItem, customData }) => {
  const {
    relatedBlogPosts,
    sanitizedHtml,
    formConfiguration,
    sanitizedCtaHtml,
  } = customData || {};
  const blogPost = dynamicPageItem.fields;
  const url = process.env.NEXT_PUBLIC_SITE_URL + "/blog/" + blogPost.slug;
  const dateStr = new Date(blogPost.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stickyCta = blogPost.ctaSticky;

  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");

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

  return (
    <article>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: blogPost.title,
            image: blogPost?.image?.url,
            keywords,
            wordcount: articleText?.split(" ").length,
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
            wordcount: articleText?.split(" ").length,
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
      <Breadcrumbs
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: blogPost.title },
        ]}
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
                    alt={blogPost.image.label || ""}
                    width={680}
                    height={336}
                    priority
                    sizes="(max-width: 480px) 360px, (max-width: 640px) 480px, 50vw"
                    className="object-fit-cover"
                  />
                </div>
              )}
              {blogPost.ctaTitle && stickyCta && (
                <div className={`${style.stickyCtaBannerMobile} bg-paleblue`}>
                  <h2 className="heading-6">{blogPost.ctaTitle}</h2>
                  <div
                    dangerouslySetInnerHTML={renderHTML(sanitizedCtaHtml)}
                  ></div>
                  <div className={style.stickyCtaBannerImage}>
                    {blogPost.ctaImage && <Media media={blogPost.ctaImage} />}
                  </div>
                  {blogPost.ctaLink && (
                    <AgilityLink
                      agilityLink={blogPost.ctaLink}
                      className="button orange small"
                      ariaLabel={`Navigate to page ` + blogPost.ctaLink.href}
                      title={`Navigate to page ` + blogPost.ctaLink.href}
                    >
                      {blogPost.ctaLink.text}
                    </AgilityLink>
                  )}
                </div>
              )}
              <div
                className={`content ${style.content}`}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              ></div>
            </div>
            <div className={style.share}>
              <ShareSocials url={url} />
            </div>
          </div>
          <div>
            <Subscribe formConfiguration={formConfiguration} />
            {blogPost.ctaTitle && stickyCta && (
              <div className={`${style.stickyCtaBanner} bg-paleblue`}>
                <h2 className="heading-6">{blogPost.ctaTitle}</h2>
                <div
                  dangerouslySetInnerHTML={renderHTML(sanitizedCtaHtml)}
                ></div>
                <div className={style.stickyCtaBannerImage}>
                  {blogPost.ctaImage && (
                    <Media media={blogPost.ctaImage} width={300} height={160} />
                  )}
                </div>
                {blogPost.ctaLink && (
                  <AgilityLink
                    agilityLink={blogPost.ctaLink}
                    className="button orange small"
                    ariaLabel={`Navigate to page ` + blogPost.ctaLink.href}
                    title={`Navigate to page ` + blogPost.ctaLink.href}
                  >
                    {blogPost.ctaLink.text}
                  </AgilityLink>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {blogPost.ctaTitle && (
        <TextWithMedia
          module={{
            fields: {
              media: blogPost.ctaImage,
              heading: JSON.stringify({
                type: "h2",
                text: blogPost.ctaTitle,
                classes: "heading-4",
              }),
              text: blogPost.ctaText,
              link: blogPost.ctaLink,
              paddingBottom: "pb-6",
              paddingTop: "pt-6",
              marginTop: "mt-4",
              linkStyle: "button pl-4 pr-4",
              linkBackgroundColor: "orange",
              backgroundColor: "bg-paleblue",
              mobileMediaPosition: "top",
              mediaPadding: "0",
            },
          }}
          customData={{ sanitizedHtml: blogPost.ctaText }}
        />
      )}
      <BlogPostList
        module={{
          fields: {
            title: "Related Articles",
            highlightedBlogPosts: relatedBlogPosts,
            paddingTop: "pt-6",
          },
        }}
        overrideClass={style.blogPostList}
        blogPosts={relatedBlogPosts}
      ></BlogPostList>
    </article>
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

    const sanitizedHtml = convertUJETLinksToHttps(
      cleanHtml(dynamicPageItem.fields.content)
    );

    const sanitizedCtaHtml = convertUJETLinksToHttps(
      cleanHtml(dynamicPageItem.fields.ctaText)
    );

    const formConfiguration = await api.getContentItem({
      referenceName: "formconfiguration",
      expandAllContentLinks: true,
      languageCode,
      contentLinkDepth: 4,
      contentID: 6018,
    });

    return {
      relatedBlogPosts,
      sanitizedHtml,
      formConfiguration: formConfiguration.fields,
      sanitizedCtaHtml,
    };
  } catch (error) {
    if (console) console.error(error);
  }
};

export default BlogPostContent;
