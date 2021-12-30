import style from "./spacer.module.scss"

const Spacer = ({ module }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${style.spacer} ${fields.classes ? fields.classes : ""}`}
    ></section>
  );
};

export default Spacer;
