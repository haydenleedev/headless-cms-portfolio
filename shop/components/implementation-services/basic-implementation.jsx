import { Component } from "react";
import layout from "../../styles/layout.module.scss";
import form from "../form/form.module.scss";
import implementation from "./implementation.module.scss";

class BasicImplementation extends Component {
  render() {
    return (
      <div className={layout.col}>
        <div
          className={`${layout.inner}  ${layout["bg-lightgray"]} ${this.props.disabled}`}
        >
          <h3 className={implementation["text-large"]}>
            {this.props.data?.name}
          </h3>
          <p className={implementation["text-mediumlarge"]}>
            Included at no additional charge
          </p>
          <p
            className={`${implementation["text-medium"]} ${implementation["mt-15px"]}`}
          >
            The Starter plan includes up to 3 hours of design consultation,
            configuration of up to 2 queues (1 language), settings
            configuration, standard CRM integration, and administration
            training.
          </p>

          <div className={implementation["checkbox-wrap"]}>
            <label
              htmlFor="permission-received"
              className={`${form.booleancheckbox}`}
            >
              <input
                name="permission-received"
                type="checkbox"
                value="unchecked"
                id="permission-received"
                onChange={this.props.onChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") this.props.onChange(e);
                }}
                checked={
                  this.props.selected === "checked" ? this.props.selected : ""
                }
              />
              <span className={form.check}>
                {this.props.data?.name} service is perfect for me.
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }
}
export default BasicImplementation;
