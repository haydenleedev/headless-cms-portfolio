import React, { Component } from "react";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import style from "./form.module.scss";
import FormError from "./formError";
import { isEmail, isPhoneNumber } from "../../shop/utils/validation";
import PardotFormField from "./pardotFormField";
import { getCookie } from "../../utils/cookies";
import {
  addGaData,
  getFallbackFieldData,
  getFormType,
  isHiddenField,
  isNonUsPhoneNumber,
  reorderFieldData,
} from "../../utils/pardotForm";
import pardotFormData from "../../data/pardotFormData.json";
import Router from "next/router";
import { boolean } from "../../utils/validation";
import PardotFormEmailStep from "./pardotFormEmailStep";

class PardotForm extends Component {
  constructor(props) {
    super(props);
    this.stepsEnabled = boolean(this.props.stepsEnabled);
    this.gaDataAdded = React.createRef(false);
    this.assessmentCreatedRef = React.createRef(false);
    this.firstPartnerFieldIndex = React.createRef(null);
    this.updateGaDataAdded = this.updateGaDataAdded.bind(this);
    this.updateSelectedCountry = this.updateSelectedCountry.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTouched = this.updateTouched.bind(this);
    this.updateStateFieldVisible = this.updateStateFieldVisible.bind(this);
    this.updatePartnerStateFieldVisible =
      this.updatePartnerStateFieldVisible.bind(this);
    this.setFieldsToMatchStep = this.setFieldsToMatchStep.bind(this);
    this.errorMessages = [
      { field: "Email", message: "Please enter a valid email" },
      {
        field: "Phone Number",
        message: "Please enter a valid phone number",
      },
    ];
    this.state = {
      errors: [],
      touched: [],
      stateFieldVisible: false,
      partnerStateFieldVisible: false,
      selectedCountry: "",
      selectedPartnerCountry: this.props.partnerCompanyCountry,
      usPhoneFormat: true,
      partnerUsPhoneFormat:
        this.props.partnerCompanyCountry == "United States" ||
        !this.props.partnerCompanyCountry,
      timestampedEmail: false,
      submitInProgress: false,
      unacceptableAssessmentScore: false,
      fieldsMatchedToStep: false,
      stepEmailFieldValue: null,
      finalStepSubmitted: false,
      clientJSEnabled: false,
    };
  }

  componentDidMount() {
    this.isDealRegistrationForm = this.props.formHandlerID == 3571;
    this.pagePath = Router.asPath;
    this.formType = getFormType(this.props.formHandlerID);
    this.setState({
      timestampedEmail: ["dealRegistration", "channelRequest"].includes(
        this.formType
      ),
    });

    for (let i = 0; i < pardotFormData.length; i++) {
      if (
        pardotFormData[i].formHandlerID == parseInt(this.props.formHandlerID)
      ) {
        this.fieldData = pardotFormData[i].fieldData;
        break;
      }
    }
    if (!this.fieldData) {
      this.fieldData = [];
    }

    let emailFieldExists = false;
    for (let i = 0; i < this.fieldData.length; i++) {
      if (this.fieldData[i].name == "Email") {
        emailFieldExists = true;
        break;
      }
    }

    if (this.fieldData.length > 0 && emailFieldExists) {
      this.fieldData.forEach((field) => {
        if (
          !isHiddenField(field, this.isDealRegistrationForm) &&
          !this.isDealRegistrationForm
        ) {
          field.isRequired = true;
        }
      });
    } else {
      this.fieldData = getFallbackFieldData(this.props.formHandlerID);
    }
    this.fieldData = reorderFieldData(this.fieldData, this.formType);
    this.fieldRefs = Array(this.fieldData.length)
      .fill(0)
      .map(() => {
        return React.createRef();
      });
    this.setState({
      errors: Array(this.fieldData.length).fill(false),
      touched: Array(this.fieldData.length).fill(false),
      clientJSEnabled: true,
    });
  }

  updateTouched(index) {
    const touched = this.state.touched;
    touched[index] = true;
    this.setState({ touched: touched });
  }

  updateGaDataAdded(newValue) {
    this.gaDataAdded.current = newValue;
  }

  updateStateFieldVisible(newValue) {
    this.setState({ stateFieldVisible: newValue });
  }

  updatePartnerStateFieldVisible(newValue) {
    this.setState({ partnerStateFieldVisible: newValue });
  }

  updateSelectedCountry(newCountryValue, isPartnerCountry) {
    const previousCountry = isPartnerCountry
      ? this.state.selectedPartnerCountry
      : this.state.selectedCountry;
    const phoneField = isPartnerCountry
      ? this.form["Partner Phone Number"]
      : this.form["Phone Number"];
    const countryStateObj = isPartnerCountry
      ? { selectedPartnerCountry: newCountryValue }
      : { selectedCountry: newCountryValue };
    this.setState(countryStateObj, () => {
      if (phoneField) {
        const usPhoneFormatCountries = ["United States", "Canada"];
        const selectedCountry = isPartnerCountry
          ? this.state.selectedPartnerCountry
          : this.state.selectedCountry;
        if (
          (usPhoneFormatCountries.includes(newCountryValue) ||
            !newCountryValue) &&
          !usPhoneFormatCountries.includes(previousCountry) &&
          previousCountry
        ) {
          const phoneFormatStateObj = isPartnerCountry
            ? { partnerUsPhoneFormat: true }
            : { usPhoneFormat: true };
          this.setState(phoneFormatStateObj, () => {
            phoneField.value = formatPhoneNumber(
              phoneField.value.replace(/\D/g, "")
            );
            this.validate();
          });
        } else if (
          !usPhoneFormatCountries.includes(newCountryValue) &&
          selectedCountry &&
          (usPhoneFormatCountries.includes(previousCountry) || !previousCountry)
        ) {
          const phoneFormatStateObj = isPartnerCountry
            ? { partnerUsPhoneFormat: false }
            : { usPhoneFormat: false };
          this.setState(phoneFormatStateObj, () => {
            phoneField.value = phoneField.value.replace(/\D/g, "");
            this.validate();
          });
        }
      }
    });
  }

  setFieldsToMatchStep(step, emailFieldValue) {
    this.currentStepFields = [];
    this.stepFields = this.props.config?.items[0].fields || {};
    this.stepFields[step]?.forEach((item) => {
      this.currentStepFields.push(item.fields.name);
    });
    this.fieldData = this.fieldData.filter((field) => {
      if (
        this.currentStepFields.includes(field.name) ||
        isHiddenField(field, this.isDealRegistrationForm)
      ) {
        if (!isHiddenField(field, this.isDealRegistrationForm)) {
          field.isRequired = true;
        }
        return field;
      }
    });
    this.fieldData = reorderFieldData(this.fieldData, this.formType);
    this.fieldRefs = Array(this.fieldData.length)
      .fill(0)
      .map(() => {
        return React.createRef();
      });
    this.setState(
      {
        errors: Array(this.fieldData.length).fill(false),
        touched: Array(this.fieldData.length).fill(false),
        fieldsMatchedToStep: true,
        stepEmailFieldValue: emailFieldValue,
        finalStepSubmitted: !step,
      },
      () => {
        if (this.state.stepEmailFieldValue && !this.state.finalStepSubmitted) {
          this.form["hiddenemail"].value = this.state.stepEmailFieldValue;
          addGaData(
            this.gaDataAdded.current,
            this.updateGaDataAdded,
            this.form["hiddenemail"],
            this.isDealRegistrationForm,
            this.formType
          );
        }
      }
    );
  }

  // START: Define specific field values for deal registration pages
  getPartnerFieldProperties(field) {
    const partnerFieldData = [
      { name: "Partner Country", value: this.props.partnerCompanyCountry },
      { name: "Partner Company Name", value: this.props.partnerCompanyName },
      { name: "Partner Company State", value: this.props.partnerCompanyState },
      { name: "Partner Company City", value: this.props.partnerCompanyCity },
      {
        name: "Alliance Referral Company",
        value: this.props.allianceReferralCompany,
      },
      { name: "Partner", value: this.props.partner },
    ];
    for (let i = 0; i < partnerFieldData.length; i++) {
      if (field.name == partnerFieldData[i].name) {
        return partnerFieldData[i];
      }
    }
    return null;
  }
  // END: Define specific field values for deal registration pages

  async handleSubmit(e) {
    e.preventDefault();
    if (
      this.onSubmitValidate() &&
      !this.form.honeyname.value &&
      !this.form.honeyemail.value &&
      !this.state.submitInProgress &&
      !this.assessmentCreatedRef.current
    ) {
      const getAssessment = () => {
        this.setState({ submitInProgress: true });
        if (!this.assessmentCreatedRef.current) {
          return new Promise((resolve) => {
            grecaptcha.enterprise.ready(async () => {
              const token = await grecaptcha.enterprise.execute(
                process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY,
                { action: "FORM_SUBMISSION" }
              );
              const assessment = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/createRecaptchaAssessment`,
                {
                  method: "POST",
                  body: JSON.stringify({ token: token }),
                }
              );
              const assessmentJSON = await assessment.json();
              this.assessmentCreatedRef.current = true;
              return resolve(assessmentJSON.isAcceptableScore);
            });
          });
        } else {
          return false;
        }
      };
      const isAcceptableScore = await getAssessment();
      if (!isAcceptableScore) {
        this.setState({
          submitInProgress: false,
          unacceptableAssessmentScore: true,
        });
        return;
      }
      if (this.state.stepEmailFieldValue && !this.form["Email"]) {
        this.form["hiddenemail"].name = "Email";
      } else if (this.state.timestampedEmail && this.form["Email"].value) {
        const splitEmail = this.form["Email"].value.split(/(@)/);
        const date = new Date();
        const timestampedEmail = `${splitEmail[0]}+ex${date.getTime()}${
          splitEmail[1]
        }${splitEmail[2]}`;
        // Set hidden email field's name to "Email" to prevent users from seeing the timestamped email
        const hiddenEmailField = this.form["hiddenemail"];
        hiddenEmailField.value = timestampedEmail;
        this.form["Email"].name = "";
        hiddenEmailField.name = "Email";
      }
      if (
        !this.state.stateFieldVisible ||
        !this.state.partnerStateFieldVisible
      ) {
        [...document.querySelectorAll("[name*=State], [name*=state]")].forEach(
          (element) => {
            if (
              this.form.contains(element) &&
              !isHiddenField(element, this.isDealRegistrationForm)
            ) {
              if (
                ((!this.state.stateFieldVisible &&
                  !element.name.toLowerCase().match(/partner/)) ||
                  (!this.state.partnerStateFieldVisible &&
                    element.name.toLowerCase().match(/partner/))) &&
                ["SELECT", "INPUT"].includes(element.nodeName)
              ) {
                element.value = "";
              }
            }
          }
        );
      }
      const clientIP = getCookie("client_ip");
      const clientCountry = getCookie("client_country");
      const clientData = {
        ip: clientIP && clientIP !== "undefined" ? clientIP : "Unknown",
        country:
          clientCountry && clientCountry !== "undefined"
            ? clientCountry
            : "Unknown",
      };
      [...this.form.getElementsByTagName("input")].forEach((input) => {
        clientData[input.name] = input.value;
      });
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saveClientData`, {
        method: "POST",
        body: JSON.stringify(clientData),
      });
      this.form.submit();
    }
  }

  getErrorMessage(fieldName) {
    let errorMessage = "Please enter a valid value";
    this.errorMessages.forEach((item) => {
      if (item.field == fieldName) {
        errorMessage = item.message;
      }
    });
    return errorMessage;
  }

  validate(submitflag = false) {
    let touched = submitflag
      ? Array(this.fieldRefs.length).fill(true)
      : this.state.touched;
    const errors = Array(this.fieldRefs.length).fill(false);
    this.fieldRefs.forEach((fieldRef, index) => {
      if (touched[index] == true) {
        if (
          ((this.fieldData[index]?.isRequired &&
            !fieldRef.current.name.toLowerCase().match(/state/)) ||
            (this.state.stateFieldVisible &&
              fieldRef.current.name.toLowerCase().match(/state/) &&
              !fieldRef.current.name.toLowerCase().match(/partner/) &&
              !isHiddenField(fieldRef.current, this.isDealRegistrationForm)) ||
            (this.state.partnerStateFieldVisible &&
              fieldRef.current.name.toLowerCase().match(/state/) &&
              fieldRef.current.name.toLowerCase().match(/partner/) &&
              !isHiddenField(fieldRef.current, this.isDealRegistrationForm))) &&
          !fieldRef.current.value
        ) {
          errors[index] = true;
        } else if (fieldRef.current.value) {
          if (fieldRef.current.type == "number" && fieldRef.current.value < 1) {
            errors[index] = true;
          } else {
            switch (fieldRef.current.name) {
              case "Phone Number":
                if (this.state.usPhoneFormat) {
                  if (
                    !isPhoneNumber(formatPhoneNumber(fieldRef.current.value))
                  ) {
                    errors[index] = true;
                  }
                } else if (!isNonUsPhoneNumber(fieldRef.current.value)) {
                  errors[index] = true;
                }
                break;
              case "Email":
                if (!isEmail(fieldRef.current.value)) {
                  errors[index] = true;
                }
                break;
              default:
                if (
                  !Boolean(fieldRef.current.value) &&
                  this.fieldData[index]?.isRequired
                ) {
                  errors[index] = true;
                }
            }
          }
        }
      }
    });
    this.setState({ errors: errors, validity: !errors.includes(true) });
    return !errors.includes(true);
  }

  onSubmitValidate() {
    this.setState({ touched: Array(this.fieldRefs.length).fill(true) });
    const flag = this.validate(true);
    return flag;
  }

  render() {
    return (
      <>
        {this.stepsEnabled && !this.state.fieldsMatchedToStep ? (
          <form
            className={style.pardotForm}
            ref={(form) => (this.stepForm = form)}
            style={{ display: this.state.clientJSEnabled ? "" : "none" }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <PardotFormEmailStep
              formHandlerID={this.props.formHandlerID}
              stepFields={this.props.config.items[0].fields}
              setFieldsToMatchStep={this.setFieldsToMatchStep}
            />
          </form>
        ) : (
          <>
            {!this.stepsEnabled ||
            (this.stepsEnabled &&
              this.state.fieldsMatchedToStep &&
              !this.state.finalStepSubmitted) ? (
              <form
                action={this.props.action}
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  this.handleSubmit(e);
                }}
                className={style.pardotForm}
                style={{ display: this.state.clientJSEnabled ? "" : "none" }}
                ref={(form) => (this.form = form)}
              >
                {this.fieldData?.map((field, index) => {
                  if (
                    this.firstPartnerFieldIndex.current === null &&
                    field.name.toLowerCase().match(/partner/) &&
                    !field.name
                      .toLowerCase()
                      .match(/partner area of interest/) &&
                    !isHiddenField(field, this.isDealRegistrationForm)
                  ) {
                    this.firstPartnerFieldIndex.current = index;
                  }
                  return (
                    <div
                      key={`formField${index}`}
                      className={
                        isHiddenField(field, this.isDealRegistrationForm) ||
                        (field.name.toLowerCase().match(/state/) &&
                          ((!field.name.toLowerCase().match(/partner/) &&
                            !this.state.stateFieldVisible) ||
                            (field.name.toLowerCase().match(/partner/) &&
                              !this.state.partnerStateFieldVisible)))
                          ? "display-none"
                          : ""
                      }
                    >
                      {!isHiddenField(field, this.isDealRegistrationForm) && (
                        <>
                          {index == this.firstPartnerFieldIndex.current && (
                            <p
                              className={`heading-6 ${style["pt-3"]} ${style["mt-3"]} ${style["pb-2"]} ${style["bt-1"]}`}
                            >
                              Your Information
                            </p>
                          )}
                          <label htmlFor={field.id}>
                            {field.isRequired && (
                              <span className={style.required}>*</span>
                            )}{" "}
                            {field.name}
                          </label>
                        </>
                      )}
                      <PardotFormField
                        field={field}
                        isDealRegistrationField={this.isDealRegistrationForm}
                        formType={this.formType}
                        fieldRef={this.fieldRefs[index]}
                        validate={this.validate}
                        updateTouched={() => {
                          this.updateTouched(index);
                        }}
                        gaDataAdded={this.gaDataAdded.current}
                        updateGaDataAdded={this.updateGaDataAdded}
                        updateStateFieldVisible={this.updateStateFieldVisible}
                        updatePartnerStateFieldVisible={
                          this.updatePartnerStateFieldVisible
                        }
                        updateSelectedCountry={this.updateSelectedCountry}
                        usPhoneFormat={
                          field.name.toLowerCase().match(/partner phone/)
                            ? this.state.partnerUsPhoneFormat
                            : this.state.usPhoneFormat
                        }
                        isContactType={this.props.contactType}
                        partnerFieldProperties={this.getPartnerFieldProperties(
                          field
                        )}
                      />
                      {this.state.errors[index] && (
                        <FormError message={this.getErrorMessage(field.name)} />
                      )}
                    </div>
                  );
                })}

                {(this.state.timestampedEmail ||
                  this.state.stepEmailFieldValue) && (
                  <input name="hiddenemail" className="display-none" />
                )}
                {this.pagePath?.includes("/resources/") && (
                  <>
                    <input
                      name="Asset_URL"
                      type="hidden"
                      value={this.pagePath}
                    />
                    <input
                      name="Asset_Type"
                      className="display-none"
                      value={
                        this.pagePath.split("/resources/")[1].split("/")[0]
                      }
                    />
                    <input
                      name="Asset_Title"
                      className="display-none"
                      value={document.getElementsByTagName("h1")[0].textContent}
                    />
                  </>
                )}
                {/* START: Honeypot */}
                <label
                  className={style.removehoney}
                  htmlFor="honeyname"
                ></label>
                <input
                  className={style.removehoney}
                  autoComplete="off"
                  type="text"
                  id="honeyname"
                  name="honeyname"
                  tabIndex="-1"
                  aria-hidden="true"
                />
                <label
                  className={style.removehoney}
                  htmlFor="honeyemail"
                ></label>
                <input
                  className={style.removehoney}
                  autoComplete="off"
                  type="email"
                  id="honeyemail"
                  name="honeyemail"
                  tabIndex="-1"
                  aria-hidden="true"
                />
                {/* END: Honeypot */}

                <div
                  className={`layout mt-4 d-flex flex-direction-column align-items-center`}
                >
                  <input
                    type="submit"
                    className={`button ${
                      this.props.btnColor ? this.props.btnColor : "orange"
                    }`}
                    value={
                      this.state.submitInProgress
                        ? "Please wait..."
                        : this.props.submit
                    }
                    required="required"
                  />
                  {this.state.unacceptableAssessmentScore && (
                    <FormError
                      message={"Something went wrong. Please try again later."}
                    />
                  )}
                </div>
              </form>
            ) : (
              <>
                {this.state.finalStepSubmitted && (
                  <p>Thank you for contacting us.</p>
                )}
              </>
            )}
          </>
        )}
        <noscript>
          <p>
            <strong>Please enable JavaScript to use the contact form.</strong>
          </p>
        </noscript>
      </>
    );
  }
}

export default PardotForm;
