import { Component } from "react";
import { IconCheckCircle } from "../icons";
import subscription from "./subscription-cycle.module.scss";
import layout from "../../styles/layout.module.scss";

class SubscriptionCard extends Component {
  render() {
    return (
      <div
        className={`${layout.col} ${layout["col-3-sm"]} ${layout.pointer} ${this.props.flag}`}
      >
        {this.props.cycle === "Annual" && (
          <span className={layout["flag-blue"]}>
            save ${this.props.diff.toLocaleString("en-US")}
          </span>
        )}
        <div
          className={`${layout.inner} ${subscription["button"]}`}
          role="button"
          aria-label={`Select ${this.props.cycle} Subscription Cycle`}
          onClick={this.props.onClick}
          onKeyPress={(e) => {
            if (e.key === "Enter") this.props.onClick(e);
          }}
          tabIndex={0}
        >
          <IconCheckCircle color="#427f11" />
          <p className={subscription.hidden}>
            Choose your UJET package subscription cycle
          </p>
          <h3 className={subscription["subscription-title"]}>
            {this.props.cycle}
          </h3>
          <p
            className={`${this.props.highliteStyle} ${subscription["text-medium"]}`}
          >
            {this.props.highlite}
          </p>
          <p className={subscription["text-large"]}>
            {this.props.price.toLocaleString("en-US")}
            <span className={subscription["text-suffix"]}>/user/month</span>
          </p>
          <p className={subscription["text-small"]}>{this.props.billing}</p>
        </div>
      </div>
    );
  }
}
export default SubscriptionCard;
