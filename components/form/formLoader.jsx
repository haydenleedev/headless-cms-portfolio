import style from "./formLoader.module.scss";

const FormLoader = () => {
  return (
    <div className={style.formLoader}>
      {[...Array(9).keys()].map((key) => (
        <div></div>
      ))}
    </div>
  );
};

export default FormLoader;
