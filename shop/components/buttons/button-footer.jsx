import { Component } from "react";
import Button from "./button";
import layout from "../../styles/layout.module.scss";
import withRouter from "next/dist/client/with-router";
import GlobalContext from "../../../context";

export default withRouter(
  class ButtonFooter extends Component {
    static contextType = GlobalContext;
    handleNext = (e) => {
      e.preventDefault();

      if (
        this.props.nextStep.includes("/subscription-cycle") &&
        !this.context.formData.addOns?.length &&
        this.props.addOns &&
        this.props.addOns.length > 0
      ) {
        this.context.updateFormData({ noAddOn: true });
        document.body.className = layout.lock;
        this.props.setModal(true);
      } else {
        this.props.router.push(this.props.nextStep);
      }
    };

    handlePrev = (e) => {
      e.preventDefault();
      this.props.router.push(this.props.prevStep);
    };

    render() {
      return (
        <div
          className={`${layout["footer-btn-theme"]} ${layout["theme-padding"]} ${this.props.scroll}`}
        >
          <div
            className={`${layout.container} ${layout.grid} ${layout["align-center"]}`}
          >
            <div className={`${layout.row} ${layout["justify-center"]}`}>
              {(this.props.prevStep || this.props.onBack) && (
                <Button
                  color="btn-white"
                  size="btn-big"
                  text="Back"
                  onClick={
                    this.props.onBack ? this.props.onBack : this.handlePrev
                  }
                />
              )}
              {(this.props.nextStep || this.props.onContinue) && (
                <Button
                  color="btn-orange"
                  size="btn-big"
                  text="Continue"
                  disable={this.props.incomplete}
                  onClick={
                    this.props.onContinue
                      ? this.props.onContinue
                      : this.handleNext
                  }
                />
              )}
            </div>
          </div>
        </div>
      );
    }
  }
);
