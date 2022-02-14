import { Component } from "react";
import customize from "./customize.module.scss";

class SectionTitle extends Component {
  render() {
    switch (this.props.wrappingTag) {
      case "label":
        return (
          <label
            className={customize["form-title-wrap"]}
            htmlFor={this.props.htmlFor}
          >
            <span className={customize.number}>{this.props.order}</span>
            <h2 className={customize["form-title"]}>{this.props.title}</h2>
          </label>
        );
      default:
        return (
          <div className={customize["form-title-wrap"]}>
            <span className={customize.number}>{this.props.order}</span>
            <h2 className={customize["form-title"]}>{this.props.title}</h2>
          </div>
        );
    }
  }
}
export default SectionTitle;
