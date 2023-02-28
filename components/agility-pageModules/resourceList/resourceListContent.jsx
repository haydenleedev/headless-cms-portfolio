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
        {fields.resource1 && (
          <div className={style.resource}>
            <GenericCard
              link={resolveLink(
                fields.resource1.properties.referenceName,
                fields.resource1.fields
              )}
              category={fields.resource1.properties.referenceName}
              overrideCategory={fields.resource1.fields.cardCategoryTitle}
              title={fields.resource1.fields.title}
              ariaTitle={fields.resource1.fields.title}
              image={
                placeholderImages?.length > 0
                  ? placeholderImages[0]
                  : fields.resource1.fields.image
              }
            />
          </div>
        )}
        {fields.resource2 && (
          <div className={style.resource}>
            <GenericCard
              link={resolveLink(
                fields.resource2.properties.referenceName,
                fields.resource2.fields
              )}
              category={fields.resource2.properties.referenceName}
              overrideCategory={fields.resource2.fields.cardCategoryTitle}
              title={fields.resource2.fields.title}
              ariaTitle={fields.resource2.fields.title}
              image={
                placeholderImages?.length > 1
                  ? placeholderImages[1]
                  : fields.resource2.fields.image
              }
            />
          </div>
        )}
        {fields.resource3 && (
          <div className={style.resource}>
            <GenericCard
              link={resolveLink(
                fields.resource3.properties.referenceName,
                fields.resource3.fields
              )}
              category={fields.resource3.properties.referenceName}
              overrideCategory={fields.resource3.fields.cardCategoryTitle}
              title={fields.resource3.fields.title}
              ariaTitle={fields.resource3.fields.title}
              image={
                placeholderImages?.length > 2
                  ? placeholderImages[2]
                  : fields.resource3.fields.image
              }
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default ResourceListContent;
