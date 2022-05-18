import { AgilityImage } from "@agility/nextjs";
import { toDate, resolveCategory } from "../../utils/convert";

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
    link,
    overrideCategory,
  } = properties;
  return (
    <div className="genericCard">
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
              className={`genericCard__image ${
                configuration?.imageHeight
                  ? `genericCard__image--${configuration?.imageHeight}`
                  : ""
              }`}
            >
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
      <div className="genericCard__textContent">
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
            className={`genericCard__textContent--title ${
              configuration?.emphasizedTitle
                ? "genericCard__textContent--titleEmphasized"
                : !date && !category && !overrideCategory && !newsSite ? "pt-2" : ""
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
        {link && (
          <p className="genericCard__textContent--link">
            <span>Read more</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default RenderGenericCard;
