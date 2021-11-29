import { AgilityImage } from "@agility/nextjs";
import { toDate } from "../../../utils/convert";
import { hrefSelf } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import style from "./blogCard.module.scss";

const BlogCard = ({ title, image, link, date, category }) => {
  const isInnerLink = hrefSelf(link.href);
  return (
    <AgilityLink
      agilityLink={link}
      ariaLabel={"Navigate to blog post: " + title}
      title={title}
      target={link?.target}
    >
      <div className={style.blogCard}>
        {image && image.pixelWidth && (
          <div className={style.image}>
            <AgilityImage
              src={image.url}
              alt={image.label || null}
              width="250"
              height="162"
              objectFit="cover"
            />
          </div>
        )}
        <div className={style.textContent}>
          {date && <p className={style.date}>{toDate(date)}</p>}
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

export default BlogCard;
