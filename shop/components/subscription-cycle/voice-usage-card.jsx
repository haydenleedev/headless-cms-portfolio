import { Component, Fragment } from "react";
import subscription from "./subscription-cycle.module.scss";
import layout from "../../styles/layout.module.scss";

class VoiceUsageCard extends Component {
  constructor(props) {
    super(props);
    // Creating unordered lists of 2 list items
    const rateUI = [];
    for (let i = 0; i < props.voiceUsage.length; i = i + 2) {
      rateUI.push(
        <ul className={`${layout.lists} ${subscription["text-small"]}`} key={i}>
          <li className={subscription["text-small"]}>
            {props.voiceUsage[i][0]}:{" "}
            <span className={subscription["text-highlight"]}>
              {props.voiceUsage[i][1]}
            </span>
            / {props.voiceUsage[i][2]}
          </li>
          {props.voiceUsage[i + 1] && (
            <li className={subscription["text-small"]}>
              {props.voiceUsage[i + 1][0]}:{" "}
              <span className={subscription["text-highlight"]}>
                {props.voiceUsage[i + 1][1]}
              </span>
              / {props.voiceUsage[i + 1][2]}
            </li>
          )}
        </ul>
      );
    }

    this.state = {
      plans: props.voiceUsage.data.reverse(),
      rateUI,
    };
  }

  render() {
    return (
      <div className={`${layout.col} ${layout["col-3-lg"]}`}>
        <div className={`${layout.inner}  ${layout["bg-lightgray"]}`}>
          <h3 className={subscription["text-medium"]}>Voice Usage</h3>
          <ul className={`${layout.bullets} ${subscription["text-small"]}`}>
            {this.props.voiceUsage.information.split("\r\n").map((row, i) => (
              <li key={"voice-usage-info" + i}>{row}</li>
            ))}
          </ul>
          <ul className={`${layout.lists} ${subscription["text-small"]}`}>
            {this.state.plans?.length > 0 &&
              this.state.plans.map((item, i) => (
                <Fragment key={"voiceUsage" + i}>
                  <li className={subscription["text-small"]}>
                    {item.fields.type}:{" "}
                    <span className={subscription["text-highlight"]}>
                      {item.fields.price}
                    </span>
                    / {item.fields.per}
                  </li>
                  {(i + 1) % 2 === 0 &&
                    i < this.props.voiceUsage.data.length - 1 && (
                      <div className="mb-3"></div>
                    )}
                  {/* {this.props.voiceUsage[i + 1] && (
                    <li className={subscription["text-small"]}>
                      {props.voiceUsage[i + 1][0]}:{" "}
                      <span className={subscription["text-highlight"]}>
                        {props.voiceUsage[i + 1][1]}
                      </span>
                      / {props.voiceUsage[i + 1][2]}
                    </li>
                  )} */}
                </Fragment>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default VoiceUsageCard;
