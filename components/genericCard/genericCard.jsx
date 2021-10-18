import style from "./genericCard.module.scss";

// A multi-purpose generic card component which can be as a card for many other componenents
// such as blog lists, resources lists, news lists etc.
const GenericCard = ({ title }) => {
  return (
    <a href="#" aria-label={title} title={title}>
      <div className={style.card}>
        <img alt="insert image here" />
        <p className={style.title}>{title}</p>
        <span className={style.link} >
          Read more
        </span>
      </div>
    </a>
  );
};

export default GenericCard;
