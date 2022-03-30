import { useEffect, Fragment } from "react";
import button from "./buttons.module.scss";

const Button = (props) => {
  let disableClass = `${button[`${props.color}`]}`;

  if (props.disable) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    disableClass = button["btn-dis"];
  } else {
    disableClass = `${button[`${props.color}`]}`;
  }

  return (
    <Fragment>
      <button
        className={`${button["btn"]} ${disableClass} ${
          button[`${props.size}`]
        } ${button[`${props.padding}`]}`}
        onClick={props.onClick}
        onSubmit={props.onSubmit}
        disabled={props.disable}
        type={props.type}
      >
        <span className={props.addClass}>{props.text}</span>
      </button>
    </Fragment>
  );
};

export default Button;
