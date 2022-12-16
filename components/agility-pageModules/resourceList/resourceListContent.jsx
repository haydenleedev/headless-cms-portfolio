import dynamic from "next/dynamic";
import Link from "next/link";
import { resolveLink } from "../../../utils/convert";
const GenericCard = dynamic(() => import("../../genericCard/genericCard"));
const Heading = dynamic(() => import("../heading"));
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
    </nav>
  );
};

export default ResourceListContent;
