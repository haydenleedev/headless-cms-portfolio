import Heading from "../heading";
import Media from "../media";
import style from "./awardsBanner.module.scss";

const AwardsBanner = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  return (
    <section
      className={`section ${style.awardsBanner} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      {fields.backgroundImage && (
        <div className={style.backgroundImage}>
          <Media media={fields.backgroundImage} />
        </div>
      )}
      <div className="container">
        <div className={style.content}>
          <aside className={style.textContent}>
            <div>
              <div className={style.heading}>
                <Heading {...heading} />
              </div>
              {fields.featuredImage && (
                <div className={style.featuredImage}>
                  <Media media={fields.featuredImage} />
                </div>
              )}
              <p className={style.description}>
                <b>{fields.description}</b>
              </p>
            </div>
          </aside>
          <aside className={`grid-columns ${style.awards}`}>
            {fields.awardImages &&
              fields.awardImages.map((award) => (
                <div
                  className="grid-column is-3 d-flex align-items-center justify-content-center"
                  key={award.contentID}
                >
                  <div className={style.awardImage}>
                    <Media media={award.fields.image} />
                  </div>
                </div>
              ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AwardsBanner;
