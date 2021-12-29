import style from "./starRating.module.scss";

const StarRating = ({ starCount, starWidth }) => {
  starCount = starCount ? parseFloat(starCount) : 5;
  const fullStarCount = Math.floor(starCount);
  const halfStar = fullStarCount % starCount !== 0;
  return (
    <div className={style.starRating}>
      {[...Array(fullStarCount).keys()].map((star) => (
        <img
          src="https://assets.ujet.cx/full-star.svg"
          key={star}
          alt=""
          width={starWidth}
          height={starWidth}
        />
      ))}
      {halfStar && (
        <img
          src="https://assets.ujet.cx/half-star.svg"
          alt=""
          width={starWidth}
          height={starWidth}
        />
      )}
    </div>
  );
};

export default StarRating;
