import Media from "../media";
import style from "./infographic.module.scss";

const Infographic = ({ module }) => {
  const { fields } = module;

  const columnsClass = (columns) => {
    switch (columns) {
      case "5":
        return style.is5;
      case "4":
        return style.is4;
      case "3":
        return style.is3;
      case "2":
        return style.is2;
    }
  };
  return (
    <section className={`section ${style.infographic}`}>
      <div className="container">
        <div
          className={`${style.content} ${
            fields.columns ? `${columnsClass(fields.columns)}` : ""
          }`}
        >
          {fields.items.map((item) => (
            <div className={`${style.item}`} key={item.contentID}>
              <div className={style.itemHeader}>
                <div className={style.itemMedia}>
                  <Media media={item.fields.image} />
                </div>
                {item.fields.title && (
                  <p className={style.itemTitle}>{item.fields.title}</p>
                )}
              </div>
              <p className={style.itemDescription}>{item.fields.description}</p>
              {item.fields.definition && (
                <p className={style.itemDefinition}>{item.fields.definition}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infographic;
