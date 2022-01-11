import { AgilityImage } from "@agility/nextjs";
import { toDate } from "../../../utils/convert";
import AgilityLink from "../../agilityLink";
import style from "./archiveCard.module.scss";

const ArchiveCard = ({ title, image, link, date, category }) => {
  return (
    <AgilityLink
      agilityLink={link}
      ariaLabel={"Navigate to blog post: " + title}
      title={title}
    >
      <div className={style.archiveCard}>
        {(image && image.pixelWidth && (
          <div className={style.image}>
            <AgilityImage
              src={image.url}
              alt={image.label || null}
              width="250"
              height="162"
              objectFit="cover"
            />
          </div>
        ))}
        <div className={style.textContent}>
          {/*           {date && <p className={style.date}>{toDate(date)}</p>} */}
          {category && <p className={style.category}>{category}</p>}
          <p className={style.title}>{title}</p>
          <p className={style.link}>
            <span>Read more</span>
          </p>
        </div>
      </div>
    </AgilityLink>
  );
};

export default ArchiveCard;
