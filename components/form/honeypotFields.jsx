import style from "./form.module.scss";

const HoneypotFields = ({}) => {
  return (
    <>
      <label className={style.removehoney} htmlFor="honeyname"></label>
      <input
        className={style.removehoney}
        autoComplete="off"
        type="text"
        id="honeyname"
        name="honeyname"
        tabIndex="-1"
        aria-hidden="true"
      />
      <label className={style.removehoney} htmlFor="honeyemail"></label>
      <input
        className={style.removehoney}
        autoComplete="off"
        type="email"
        id="honeyemail"
        name="honeyemail"
        tabIndex="-1"
        aria-hidden="true"
      />
    </>
  );
};

export default HoneypotFields;
