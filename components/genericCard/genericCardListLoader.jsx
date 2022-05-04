const GenericCardListLoader = ({ imageFieldHeight }) => {
  return (
    <div className="genericCardListLoader columns repeat-3">
      {[...Array(9).keys()].map((key) => (
        <div className={`genericCardLoading ${imageFieldHeight ? `genericCardLoading--${imageFieldHeight}` : ""}`} key={`loadingCard${key}`}>
          <div className={`loadingImageField ${imageFieldHeight ? `loadingImageField--${imageFieldHeight}` : ""}`}></div>
          <div className="loadingTextContent">
            <div className="loadingTextFieldWide"></div>
            <div className="loadingTextFieldNarrow"></div>
            <div className="loadingTextFieldWide"></div>
            <div className="loadingTextFieldNarrow"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenericCardListLoader;
