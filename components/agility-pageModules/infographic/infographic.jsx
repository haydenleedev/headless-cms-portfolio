import { boolean } from "../../../utils/validation";
import Media from "../media";
import style from "./infographic.module.scss";

const Infographic = ({ module }) => {
  const { fields } = module;
  const itemLayout = fields?.alternateItemLayout;
  const boxStyle = boolean(fields?.boxStyle);

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
  const itemLayoutClass = (itemLayout) => {
    switch (itemLayout) {
      case "column":
        return style.itemColumnLayout;
      case "row":
        return style.itemRowLayout;
      case "row-reverse":
        return style.itemRowReverseLayout;
    }
  };
  return (
    <section className={`section ${style.infographic}`}>
      <div className="container">
        <div
          className={`${style.content} ${
            fields.columns ? `${columnsClass(fields.columns)}` : ""
          } ${boxStyle ? style.boxStyle : ""}`}
        >
          {fields.items.map((item) => (
            <div
              className={`${style.item} ${itemLayoutClass(itemLayout)}`}
              key={item.contentID}
            >
              <div className={style.itemMedia}>
                {item.fields.image && <Media media={item.fields.image} />}
                {itemLayout === "column" && item.fields.title && (
                  <p className={style.itemTitle}>{item.fields.title}</p>
                )}
              </div>

              <div className={style.itemTextContent}>
                {itemLayout !== "column" && item.fields.title && (
                  <p className={style.itemTitle}>{item.fields.title}</p>
                )}
                {item.fields.description && (
                  <p className={style.itemDescription}>
                    {item.fields.description}
                  </p>
                )}
                {item.fields.definition && (
                  <p className={style.itemDefinition}>
                    {item.fields.definition}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infographic;
