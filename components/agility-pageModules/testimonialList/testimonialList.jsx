import style from "./testimonialList.module.scss";
import TestimonialListLayout from "./testimonialListLayout";

const TestimonialList = ({ module }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${style.testimonialList} ${
        fields.classes ? fields.classes : "bg-lightgray"
      } ${fields.renderAs === "slider" ? style.translateSliderControls : ""}`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        <TestimonialListLayout {...fields} />
      </div>
    </section>
  );
};

export default TestimonialList;
