import style from "./form.module.scss";

const FormError = ({ message }) => {
  return (
    <div className={style["form-message-wrapper"]}>
      <span className={style["visuallyhidden"]}>Error:</span>
      <span className={style["form-message"]}>{message}</span>
    </div>
  );
};

export default FormError;
