import FormError from "./formError";
import style from "./form.module.scss";
import React, { Component } from "react";
import { isEmail } from "../../shop/utils/validation";
import { getFormType } from "../../utils/pardotForm";

class PardotFormEmailStep extends Component {
  constructor(props) {
    super(props);
    this.emailRef = React.createRef(null);
    this.state = {
      emailError: false,
      nextStepFetched: false,
      stepFetchInProgress: false,
    };
  }

  validateEmail() {
    let validEmail = isEmail(this.emailRef.current.value);
    this.setState({ emailError: !validEmail });
    return validEmail;
  }

  async updateCurrentStep() {
    this.setState({ stepFetchInProgress: true });
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getSubmittedPardotFields`,
      {
        method: "POST",
        body: JSON.stringify({
          email: this.emailRef.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    const submittedFields = responseJSON.submittedFields;
    const submittedFieldKeys = Object.keys(submittedFields);
    const submittedFieldNames = [];
    submittedFieldKeys.forEach((key) => {
      if (submittedFields[key]) {
        submittedFieldNames.push(key);
      }
    });
    const stepFieldKeys = Object.keys(this.props.stepFields);
    let currentStep = null;
    stepFieldKeys.some((key) => {
      if (key.includes(this.formType)) {
        this.props.stepFields[key].some((field) => {
          if (!submittedFieldNames.includes(field.fields.name)) {
            currentStep = key;
            return true;
          }
        });
      }
      if (currentStep) {
        return true;
      }
    });
    this.setState({ stepFetchInProgress: false });
    this.props.setFieldsToMatchStep(currentStep, this.emailRef.current.value);
  }

  componentDidMount() {
    this.formType = getFormType(this.props.formHandlerID);
  }

  render() {
    return (
      <>
        <div>
          <label htmlFor="stepEmail">
            <span className={style.required}>*</span> Email
          </label>
          <input
            name="stepEmail"
            ref={this.emailRef}
            onBlur={() => {
              this.validateEmail();
            }}
          />
          {this.state.emailError && (
            <FormError message={"Please enter a valid email"} />
          )}
        </div>
        <div className="layout mt-4 d-flex flex-direction-column align-items-center">
          <button
            className="button orange"
            onClick={(e) => {
              e.preventDefault();
              if (this.validateEmail() && !this.state.stepFetchInProgress) {
                this.updateCurrentStep();
              }
            }}
          >
            {this.state.stepFetchInProgress ? "Please wait..." : "Next"}
          </button>
        </div>
      </>
    );
  }
}

export default PardotFormEmailStep;
