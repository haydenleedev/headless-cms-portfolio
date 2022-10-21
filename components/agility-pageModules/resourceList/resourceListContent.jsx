import Link from "next/link";
import { resolveLink } from "../../../utils/convert";
import GenericCard from "../../genericCard/genericCard";
import Heading from "../heading";
import style from "./resourceList.module.scss";

const ResourceListContent = ({ fields, customData }) => {
  const { mappedResourceListCategory } = customData;
  const heading = JSON.parse(fields.heading);
  const resources =
    mappedResourceListCategory[fields.resourceListCategory]?.content;
  const placeholderImages = [];
  if (fields.overrideImages && fields.overrideImages.media) {
    fields.overrideImages?.media?.forEach((image) => {
      placeholderImages.push({
        url: image.url,
        pixelWidth: 3,
        pixelHeight: 2,
      });
    });
  }

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${fields.classes ? fields.classes : ""} ${
        style.resourceList
      }
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <nav className="container" aria-label="resource list">
        {heading.text && (
          <div className={`heading ${style.heading}`}>
            <Heading {...heading} />
          </div>
        )}
        <div className={style.resources}>
          {fields.highlightedResources
            ? fields.highlightedResources.map((resource, index) => (
                <div className={style.resource} key={resource.contentID}>
                  <GenericCard
                    link={resolveLink(
                      resource.properties.referenceName,
                      resource.fields
                    )}
                    category={resource.properties.referenceName}
                    overrideCategory={resource.fields.cardCategoryTitle}
                    title={resource.fields.title}
                    ariaTitle={resource.fields.title}
                    image={
                      placeholderImages?.length > index
                        ? placeholderImages[index]
                        : resource.fields.image
                    }
                  />
                </div>
              ))
            : resources?.map((resource, index) => (
                <div className={style.resource} key={resource.contentID}>
                  <GenericCard
                    link={resolveLink(
                      resource.properties.referenceName,
                      resource.fields
                    )}
                    category={resource.properties.referenceName}
                    overrideCategory={resource.fields.cardCategoryTitle}
                    title={resource.fields.title}
                    image={
                      placeholderImages?.length >= index
                        ? placeholderImages[index]
                        : resource.fields.image
                    }
                  />
                </div>
              ))}
        </div>
        {fields.resourceListCategory && (
          <div className={style.link}>
            <Link
              href={`/archives?type=resources&categories=${mappedResourceListCategory[
                fields.resourceListCategory
              ].types.map((type, i) => {
                if (
                  i <
                  mappedResourceListCategory[fields.resourceListCategory].types
                    .length -
                    1
                )
                  return `${type},`;
                return `${type}`;
              })}`
                .split(" ")
                .join("")}
            >
              <a
                className="button cyan outlined"
                aria-label="Navigate to page resource archives page"
                title="Navigate to page resource archives page"
              >
                Read More
              </a>
            </Link>
          </div>
        )}
      </nav>
    </section>
  );
};

export default ResourceListContent;
