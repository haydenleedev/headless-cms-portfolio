import style from "./spacer.module.scss";

const Spacer = ({ module }) => {
  const { fields } = module;
  return (
    <div
      className={`section ${style.spacer} ${
        fields.classes ? fields.classes : ""
      }${fields.spaceHeight ? " " + fields.spaceHeight : " pt-3 pb-3"}`}
    ></div>
  );
};

export default Spacer;
