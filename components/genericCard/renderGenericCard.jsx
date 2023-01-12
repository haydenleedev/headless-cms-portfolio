import { AgilityImage } from "@agility/nextjs";
import { toDate, resolveCategory } from "../../utils/convert";
import style from "./genericCard.module.scss";
import { renderHTML } from "@agility/nextjs";

const RenderGenericCard = ({ properties }) => {
  const {
    image,
    configuration,
    title,
    category,
    date,
    newsSite,
    podcast,
    description,
    text,
    textAlignment,
    link,
    overrideCategory,
    brandLayout,
    smallImage,
    imageWrapperClasses,
  } = properties;
  return (
    <div className={`${brandLayout ? style.card : "genericCard"}`}>
      {(image || configuration?.defaultImage) && (
        <>
          {configuration?.iconStyleImage ? (
            <div
              className={`genericCard__titleWithIcon ${
                configuration?.imageHeight
                  ? `genericCard__titleWithIcon--${configuration?.imageHeight}`
                  : ""
              }`}
            >
              <div className={`genericCard__titleWithIcon--icon `}>
                {image && image.pixelWidth ? (
                  <AgilityImage
                    src={image.url}
                    alt={image.label || ""}
                    width={image.pixelWidth}
                    height={image.pixelHeight}
                    objectFit="cover"
                    layout="responsive"
                  />
                ) : (
                  configuration?.defaultImage && (
                    <AgilityImage
                      src={configuration?.defaultImage}
                      alt=""
                      width="250"
                      height="162"
                      objectFit="contain"
                    />
                  )
                )}
              </div>
              <div className="genericCard__titleWithIcon--title">{title}</div>
            </div>
          ) : (
            <div
              className={`${imageWrapperClasses} ${
                smallImage ? style.smallerSize : style.normalSize
              } ${
                brandLayout
                  ? `${style.imageWrapper} ${
                      imageWrapperClasses?.match(/bg-*/)
                        ? style.colorCardImageWrapper
                        : ""
                    }`
                  : `genericCard__image ${
                      configuration?.imageHeight
                        ? `genericCard__image--${configuration?.imageHeight}`
                        : ""
                    }`
              }`}
            >
              {brandLayout ? (
                <AgilityImage
                  src={image.url}
                  width={0}
                  height={0}
                  layout="responsive"
                  objectFit="contain"
                />
              ) : image && image.pixelWidth ? (
                <AgilityImage
                  src={image.url}
                  alt={image.label || ""}
                  width={image.pixelWidth}
                  height={image.pixelHeight}
                  objectFit="cover"
                  layout="responsive"
                />
              ) : (
                <AgilityImage
                  src={configuration?.defaultImage}
                  alt=""
                  width="250"
                  height="162"
                  objectFit="contain"
                />
              )}
            </div>
          )}
        </>
      )}
      <div
        className={`${
          brandLayout ? style.textContent : "genericCard__textContent"
        }
      ${
        image &&
        !configuration?.iconStyleImage &&
        brandLayout &&
        style.imageCardTextContent
      }`}
      >
        {date && (
          <p className="genericCard__textContent--date">{toDate(date)}</p>
        )}
        {category && !overrideCategory && (
          <p className="genericCard__textContent--category">
            {resolveCategory(category)}
            {podcast && (
              <span className="genericCard__textContent--podcast">Podcast</span>
            )}
          </p>
        )}
        {overrideCategory && (
          <p className="genericCard__textContent--category">
            {overrideCategory}
            {podcast && (
              <span className="genericCard__textContent--podcast">Podcast</span>
            )}
          </p>
        )}
        {newsSite && (
          <p className="genericCard__textContent--newsSite">{newsSite}</p>
        )}
        {title && !configuration?.iconStyleImage && (
          <p
            className={`${
              brandLayout
                ? style.title
                : `genericCard__textContent--title ${
                    configuration?.emphasizedTitle
                      ? "genericCard__textContent--titleEmphasized"
                      : !date && !category && !overrideCategory && !newsSite
                      ? "pt-2"
                      : ""
                  }`
            }`}
          >
            {title}
          </p>
        )}
        {description && (
          <p
            className={`genericCard__textContent--description line-clamp ${
              link ? "" : "pb-3"
            } ${
              configuration?.descriptionAlignment
                ? `align-${configuration.descriptionAlignment}`
                : "align-left"
            }`}
          >
            {description}
          </p>
        )}
        {text && (
          <div
            dangerouslySetInnerHTML={renderHTML(text)}
            className={textAlignment == "left" ? "align-left" : "align-center"}
          />
        )}
        {link && (
          <p
            className={
              brandLayout ? style.linkText : "genericCard__textContent--link"
            }
          >
            <span>{brandLayout ? link.text : "Read more"}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default RenderGenericCard;
