import { AgilityImage } from "@agility/nextjs";
import Link from "next/link";
import { toDate, resolveCategory } from "../../utils/convert";
import { hrefSelf } from "../../utils/validation";

// A multi-purpose generic card component which can be as a card for many other componenents
// such as blog lists, resources lists, news lists etc.
const GenericCard = ({ date, category, title, description, image, link, ariaTitle }) => {
  const isInnerLink = hrefSelf(link.href);
  return (
    <Link href={isInnerLink ? link : link.href}>
      <a
        aria-label={"Navigate to blog post: " + ariaTitle}
        title={ariaTitle}
        target={link?.target}
      >
        <div className="genericCard">
          {image && (
            <div className="genericCard__image">
              <AgilityImage
                src={image.url}
                alt={image.label || null}
                width={image.pixelWidth}
                height={image.pixelHeight}
                objectFit="cover"
              />
            </div>
          )}
          <div className="genericCard__textContent">
            {date && (
              <p className="genericCard__textContent--date">{toDate(date)}</p>
            )}
            {category && (
              <p className="genericCard__textContent--category">
                {resolveCategory(category)}
              </p>
            )}
            <p className="genericCard__textContent--title">{title}</p>
            {description && (
              <p className="genericCard__textContent--description line-clamp">
                {description}
              </p>
            )}
            <p className="genericCard__textContent--link">
              <span>Read more</span>
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default GenericCard;
