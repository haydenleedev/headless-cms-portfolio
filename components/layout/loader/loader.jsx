import style from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={style.container}>
      <div
        className={style.loader}
        aria-label="A page component is loading"
        title="A page component is loading"
      ></div>
    </div>
  );
};

export default Loader;
