import { Component } from "react";
import form from "./form.module.scss";

class FormErrors extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.lookupSalesForce(event.target.email.value);
  }
  render() {
    return (
      <div className={form["form-message-wrapper"]}>
        <span className={form["visuallyhidden"]}>Error:</span>
        <span className={form["form-message"]}>{this.props.message}</span>
      </div>
    );
  }
}

export default FormErrors;
