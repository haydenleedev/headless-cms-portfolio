import style from "./archivesLoader.module.scss";

const ArchivesLoader = () => {
  return (
    <div className={`columns repeat-3 ${style.archivesLoader}`}>
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

export default ArchivesLoader;
