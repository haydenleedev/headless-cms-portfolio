import style from "./blogLoader.module.scss";

const BlogLoader = () => {
  return (
    <div className={`columns repeat-3 ${style.blogLoader}`}>
      {[...Array(9).keys()].map((key) => (
        <div className={style.loadingCard} key={`loadingCard${key}`}>
          <div className={style.loadingImageField}></div>

          <div className={style.loadingTextContent}>
            <div className={style.loadingTextFieldWide}></div>
            <div className={style.loadingTextFieldNarrow}></div>
            <div className={style.loadingTextFieldWide}></div>
            <div className={style.loadingTextFieldNarrow}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogLoader;
