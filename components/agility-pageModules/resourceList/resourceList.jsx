import dynamic from "next/dynamic";
const ResourceListContent = dynamic(() => import("./resourceListContent"), {
  ssr: false,
});
import style from "./resourceList.module.scss";

const ResourceList = ({ module }) => {
  const { fields } = module;

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
      <ResourceListContent fields={fields} />
    </section>
  );
};

export default ResourceList;
