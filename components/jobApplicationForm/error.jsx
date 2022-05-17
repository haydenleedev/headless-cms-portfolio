import { Component } from "react";
import style from "./jobApplicationForm.module.scss";

class FormErrors extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
  }
  render() {
    return (
      <div className={style["form-message-wrapper"]}>
        <span className={style["visuallyhidden"]}>Error:</span>
        <span className={style["form-message"]}>{this.props.message}</span>
      </div>
    );
  }
}

export default FormErrors;
