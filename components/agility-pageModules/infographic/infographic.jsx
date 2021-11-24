import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import style from "./infographic.module.scss";

const Infographic = ({ module }) => {
  const { fields } = module;
  const itemLayout = fields?.alternateItemLayout;
  const boxStyle = boolean(fields?.boxStyle);
  const narrowContainer = boolean(fields?.narrowContainer);
  const heading = fields.heading ? JSON.parse(fields.heading) : null;

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
      case "column-title-large":
        return style.itemColumnLargeTitleLayout;
      case "row":
        return style.itemRowLayout;
      case "row-reverse":
        return style.itemRowReverseLayout;
    }
  };
  return (
    <section className={`section ${style.infographic}`}>
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        {heading && (
          <div className="heading">
            <Heading {...heading} />
          </div>
        )}
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
              {item.fields.image && (
                <div className={style.itemMedia}>
                  <Media media={item.fields.image} />
                  {itemLayout === "column" && item.fields.title && (
                    <p className={style.itemTitle}>{item.fields.title}</p>
                  )}
                </div>
              )}
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
