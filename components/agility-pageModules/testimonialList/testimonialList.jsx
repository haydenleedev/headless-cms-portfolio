import style from "./testimonialList.module.scss";
import TestimonialListLayout from "./testimonialListLayout";
import Heading from "../heading";


const TestimonialList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  return (
    <section
      className={`section ${style.testimonialList} ${
        fields.classes ? fields.classes : "bg-lightgray"
      } ${fields.renderAs === "slider" ? style.translateSliderControls : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        {heading.text && (
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
