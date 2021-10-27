import GenericCard from "../../genericCard/genericCard";
import Heading from "../heading";
import style from "./resourceList.module.scss";

const ResourceList = ({ module }) => {
  const { fields } = module;
  console.log(fields);
  const heading = JSON.parse(fields.heading);
  return (
    <section className={`section ${style.resourceList}`}>
      <div className="container">
        {heading.text && (
          <div className="heading">
            <Heading {...heading} />
          </div>
        )}
        <div className={style.resources}>
          {fields.resources.map((resource) => (
            <div className={style.resource} key={resource.contentID}>
              <GenericCard
                link={resource.fields.link}
                category={resource.properties.referenceName}
                title={resource.fields.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceList;
