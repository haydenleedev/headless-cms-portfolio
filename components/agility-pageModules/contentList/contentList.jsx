import { resolveCategory, resolveLink } from "../../../utils/convert";
import GenericCard from "../../genericCard/genericCard";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));
import style from "./contentList.module.scss";

const ContentList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const count = parseInt(fields.count);

  const resolveItems = () => {
    const blogPosts = fields?.blogPosts;
    const news = fields?.news;
    const pressReleases = fields?.pressReleases;
    const resources = fields?.resources;
    const externalLinks = fields?.externalLinks;

    let items = [];
    [blogPosts, news, pressReleases, resources, externalLinks].forEach(
      (list) => {
        // non-existing lists are undefined, spread list content to items if list exists
        if (list) items = [...items, ...list];
      }
    );
    return items;
  };

  const items = resolveItems().slice(0, count);

  // the different content types use different fields for the card title
  const resolveTitle = (referenceName, fields) => {
    switch (referenceName) {
      case "news":
        return fields.articleTitle;
      case "externalcontent":
        return fields.articleTitle;
      default:
        return fields.title;
    }
  };

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${mtValue} ${mbValue} ${ptValue} ${pbValue}
      ${style.contentList} ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <nav className="container" aria-label="content list">
        {heading.text && (
          <div className={style.heading}>
            <Heading {...heading} />
          </div>
        )}
        <div className={style.items}>
          {items &&
            items.map((contentItem) => (
              <div className={style.contentItem} key={contentItem.contentID}>
                <GenericCard
                  link={resolveLink(
                    contentItem.properties.referenceName,
                    contentItem.fields
                  )}
                  category={
                    contentItem.fields?.referenceName ||
                    resolveCategory(contentItem.properties.referenceName)
                  }
                  title={resolveTitle(
                    contentItem.properties.referenceName,
                    contentItem.fields
                  )}
                  ariaTitle={resolveTitle(
                    contentItem.properties.referenceName,
                    contentItem.fields
                  )}
                  image={contentItem.fields.image}
                />
              </div>
            ))}
        </div>
      </nav>
    </section>
  );
};

export default ContentList;
