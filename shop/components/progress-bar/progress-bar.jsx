import Head from "next/head";
import { Component } from "react";
import * as svgComponent from "../icons";
import bar from "./progress-bar.module.scss";
import icon from "../buttons/buttons.module.scss";

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.progressStep = this.props.progress;
    switch (this.props.progress) {
      case 1:
        this.step1 = `${bar.completed} ${bar.current}`;
        break;
      case 2:
        this.step1 = bar.completed;
        this.step2 = `${bar.completed} ${bar.current}`;
        this.step2Act = bar.active;
        break;
      case 3:
        this.step1 = bar.completed;
        this.step2 = bar.completed;
        this.step3 = `${bar.completed} ${bar.current}`;
        this.step3Act = bar.active;
        break;
      case 4:
        this.step1 = bar.completed;
        this.step2 = bar.completed;
        this.step3 = bar.completed;
        this.step4 = `${bar.completed} ${bar.current}`;
        this.step4Act = bar.active;
        break;
      case 5:
        this.step1 = bar.completed;
        this.step2 = bar.completed;
        this.step3 = bar.completed;
        this.step4 = bar.completed;
        this.step5 = `${bar.completed} ${bar.current}`;
        this.step5Act = bar.active;
        break;
      case 6:
        this.step1 = bar.completed;
        this.step2 = bar.completed;
        this.step3 = bar.completed;
        this.step4 = bar.completed;
        this.step5 = bar.completed;
        this.step6 = `${bar.completed} ${bar.current}`;
        break;
      default:
        this.step2Act = bar.active;
        this.progressStep = 1;
    }
  }
  render() {
    return (
      <div className={bar["progress-steps"]}>
        <div className={`${bar["progress-step"]} ${this.step1}`}>
          <div className={bar["header-border"]}>
            {this.progressStep > 1 && <svgComponent.IconCheckCircle />}
            {this.progressStep <= 1 && (
              <div className={`${icon.circle} ${icon.blue}`}></div>
            )}
            <div className={bar["header-line"]}></div>
          </div>
          <span role="heading" aria-level="1" className={bar["step-info"]}>
            Customize
          </span>
        </div>

        {!this.props.freeFlow && (
          <div className={`${bar["progress-step"]} ${this.step2}`}>
            <div className={bar["header-border"]}>
              <div className={bar["header-line"]}></div>
              {this.progressStep > 2 && <svgComponent.IconCheckCircle />}
              {this.progressStep == 2 && (
                <div className={`${icon.circle} ${icon.blue}`}></div>
              )}
              {this.progressStep < 2 && <div className={icon.circle}></div>}
              <div className={`${bar["header-line"]} ${this.step2Act}`}></div>
            </div>
            <span role="heading" aria-level="1" className={bar["step-info"]}>
              Choose Subscription
            </span>
          </div>
        )}

        <div className={`${bar["progress-step"]} ${this.step3}`}>
          <div className={bar["header-border"]}>
            <div className={bar["header-line"]}></div>
            {this.progressStep > 3 && <svgComponent.IconCheckCircle />}
            {this.progressStep == 3 && (
              <div className={`${icon.circle} ${icon.blue}`}></div>
            )}
            {this.progressStep < 3 && <div className={icon.circle}></div>}
            <div className={`${bar["header-line"]} ${this.step3Act}`}></div>
          </div>
          <span role="heading" aria-level="1" className={bar["step-info"]}>
            Contact Information
          </span>
        </div>

        {!this.props.freeFlow && (
          <div className={`${bar["progress-step"]} ${this.step4}`}>
            <div className={bar["header-border"]}>
              <div className={bar["header-line"]}></div>
              {this.progressStep > 4 && <svgComponent.IconCheckCircle />}
              {this.progressStep == 4 && (
                <div className={`${icon.circle} ${icon.blue}`}></div>
              )}
              {this.progressStep < 4 && <div className={icon.circle}></div>}
              <div className={`${bar["header-line"]} ${this.step4Act}`}></div>
            </div>
            <span role="heading" aria-level="1" className={bar["step-info"]}>
              Payment Details
            </span>
          </div>
        )}

        <div className={`${bar["progress-step"]} ${this.step5}`}>
          <div className={bar["header-border"]}>
            <div className={bar["header-line"]}></div>
            {this.progressStep > 5 && <svgComponent.IconCheckCircle />}
            {this.progressStep == 5 && (
              <div className={`${icon.circle} ${icon.blue}`}></div>
            )}
            {this.progressStep < 5 && <div className={icon.circle}></div>}
            <div className={`${bar["header-line"]} ${this.step5Act}`}></div>
          </div>
          <span role="heading" aria-level="1" className={bar["step-info"]}>
            Review Order
          </span>
        </div>

        <div className={`${bar["progress-step"]} ${this.step6}`}>
          <div className={bar["header-border"]}>
            <div className={bar["header-line"]}></div>
            {this.progressStep > 6 && <svgComponent.IconCheckCircle />}
            {this.progressStep == 6 && (
              <div className={`${icon.circle} ${icon.blue}`}></div>
            )}
            {this.progressStep < 6 && <div className={icon.circle}></div>}
          </div>
          <span role="heading" aria-level="1" className={bar["step-info"]}>
            Confirmation
          </span>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
