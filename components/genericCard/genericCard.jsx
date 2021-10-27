import { AgilityImage } from "@agility/nextjs";
import style from "./genericCard.module.scss";
import Link from "next/link";

// A multi-purpose generic card component which can be as a card for many other componenents
// such as blog lists, resources lists, news lists etc.
const GenericCard = ({ category, title, image, link }) => {
  return (
    <Link href={link}>
      <a aria-label={"Navigate to blog post: " + title} title={title}>
        <div className={style.card}>
          <div className={style.image}>
            {image && (
              <AgilityImage
                src={image.url}
                alt={image.label || null}
                width={image.pixelWidth}
                height={image.pixelHeight}
                objectFit="cover"
              />
            )}
          </div>
          <div className={style.textContent}>
            {category && <p className={style.category}>{category}</p>}
            <p className={style.title}>{title}</p>
            <span className={style.link}>Read more</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default GenericCard;
