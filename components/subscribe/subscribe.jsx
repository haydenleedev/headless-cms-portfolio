import style from "./subscribe.module.scss";

// TODO: Hook this up with Marketo and Agility.
const Subscribe = ({}) => {
  return (
    <div className={style.subscribe}>
      <span className={style.heading}>Subscribe</span>
      <p className={style.title}>The best customer experience content delivered right to your inbox.</p>
      <form>
        <label htmlFor="email" className={style.label}>
          <span aria-hidden className="color-red">* </span>Business email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Please enter your business email"
          required
          aria-required
        ></input>
        <label htmlFor="country" className={style.label}>
          <span aria-hidden className="color-red">* </span>Country (Corp HQ)
        </label>
        <input
          id="country"
          name="country"
          type="text"
          placeholder="Please enter your company's country"
          required
          aria-required
        ></input>
        <label htmlFor="state" className={style.label}>
          <span aria-hidden className="color-red">* </span>Country (Corp HQ)
        </label>
        <input
          id="state"
          name="state"
          type="text"
          placeholder="Please enter your company's state"
          required
          aria-required
        ></input>
        <button type="submit" className={`button ${style.subscribeButton}`}>Subscribe to UJET Blog</button>
      </form>
    </div>
  );
};

export default Subscribe;
