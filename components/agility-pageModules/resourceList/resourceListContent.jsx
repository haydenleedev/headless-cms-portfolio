import dynamic from "next/dynamic";
import Link from "next/link";
import { resolveLink } from "../../../utils/convert";
const GenericCard = dynamic(() => import("../../genericCard/genericCard"), {
  ssr: false,
});
const Heading = dynamic(() => import("../heading"), { ssr: false });
import style from "./resourceList.module.scss";

const ResourceListContent = ({ fields }) => {
  const heading = JSON.parse(fields.heading);
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
  return (
    <nav className="container" aria-label="resource list">
      {heading.text && (
        <div className={`heading ${style.heading}`}>
          <Heading {...heading} />
        </div>
      )}
      <div className={style.resources}>
        {fields.highlightedResources.map((resource, index) => (
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
  );
};

export default ResourceListContent;
