import style from "./testimonialList.module.scss";
import TestimonialListLayout from "./testimonialListLayout";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));

const TestimonialList = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading && JSON.parse(fields.heading);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.testimonialList}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields.renderAs === "slider" ? style.translateSliderControls : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        {heading?.text && (
          <div className={style.heading}>
            <Heading {...heading} />
          </div>
        )}
        <TestimonialListLayout {...fields} />
      </div>
    </section>
  );
};

export default TestimonialList;
