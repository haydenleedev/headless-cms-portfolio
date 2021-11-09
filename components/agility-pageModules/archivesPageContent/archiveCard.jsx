import { AgilityImage } from "@agility/nextjs";
import Link from "next/link";
import { toDate } from "../../../utils/convert";
import { hrefSelf } from "../../../utils/validation";
import style from "./archiveCard.module.scss";

const ArchiveCard = ({ title, image, link }) => {
  const isInnerLink = hrefSelf(link.href);
  return (
    <Link href={isInnerLink ? link : link.href}>
      <a
        aria-label={"Navigate to blog post: " + title}
        title={title}
        target={link?.target}
      >
        <div className={style.archiveCard}>
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
            <p className={style.title}>{title}</p>
            <p className={style.link}>
              <span>Read more</span>
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ArchiveCard;
