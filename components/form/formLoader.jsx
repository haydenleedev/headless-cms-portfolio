import style from "./formLoader.module.scss";

const FormLoader = () => {
  return (
    <div className={style.formLoader}>
      {[...Array(9).keys()].map((key) => (
        <div key={key}></div>
      ))}
    </div>
  );
};

export default FormLoader;
