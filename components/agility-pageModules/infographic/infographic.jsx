import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import style from "./infographic.module.scss";

const Infographic = ({ module }) => {
  const { fields } = module;
  const itemLayout = fields?.alternateItemLayout;
  const boxStyle = boolean(fields?.boxStyle);
  const narrowContainer = boolean(fields?.narrowContainer);
  const itemRoundedCorners = boolean(fields?.itemRoundedCorners);
  const itemShadow = boolean(fields?.itemShadow);
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const itemContentCenterAlign = boolean(fields?.itemContentCenterAlign);

  fields.items.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

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
    <section
      className={`section ${style.infographic} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        {heading?.text && (
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
              className={`${style.item} ${itemLayoutClass(itemLayout)} ${
                itemShadow ? style.itemShadow : ""
              } ${itemRoundedCorners ? "border-radius-1" : ""}`}
              key={item.contentID}
            >
              {(itemLayout === "column" && item.fields.title) ||
                (item.fields.image && (
                  <div className={style.itemMedia}>
                    {item.fields.image && <Media media={item.fields.image} />}
                    {itemLayout === "column" && item.fields.title && (
                      <p className={`${style.itemTitle} w-600 text-darkblue`}>
                        {item.fields.title}
                      </p>
                    )}
                  </div>
                ))}
              <div
                className={`${style.itemTextContent} ${
                  itemContentCenterAlign ? style["align-items-center"] : ""
                }`}
              >
                {itemLayout !== "column" && item.fields.title && (
                  <p className={`${style.itemTitle} w-600 text-darkblue`}>
                    {item.fields.title}
                  </p>
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
