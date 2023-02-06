import React, { Component } from "react";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import style from "./form.module.scss";
import FormError from "./formError";
import {
  isEmail,
  isPhoneNumber,
  isFreeEmail,
} from "../../shop/utils/validation";
import PardotFormField from "./pardotFormField";
import { getCookie } from "../../utils/cookies";
import {
  addGaData,
  blockedContactFormCountries,
  getFallbackFieldData,
  getFormType,
  isHiddenField,
  isNonUsPhoneNumber,
  reorderFieldData,
} from "../../utils/pardotForm";
import { boolean } from "../../utils/validation";
import PardotFormEmailStep from "./pardotFormEmailStep";
import HoneypotFields from "./honeypotFields";
import LazyLoadReCAPTCHA from "./lazyLoadReCAPTCHA";

class PardotForm extends Component {
  constructor(props) {
    super(props);
    this.stepsEnabled = boolean(this.props.stepsEnabled);
    this.formInViewEventPushed = false;

    // Refs are used for these values instead of state because they need to be updated synchronously
    this.assessmentCreatedRef = React.createRef(false);
    this.firstPartnerFieldIndex = React.createRef(null);
    this.gaDataAdded = React.createRef(false);

    // Bind value of this to state setters and some other functions to allow PardotFormField to access this component's values
    this.updateTouched = this.updateTouched.bind(this);
    this.updateStateFieldVisible = this.updateStateFieldVisible.bind(this);
    this.updatePartnerStateFieldVisible =
      this.updatePartnerStateFieldVisible.bind(this);
    this.updateGaDataAdded = this.updateGaDataAdded.bind(this);
    this.setFieldsToMatchStep = this.setFieldsToMatchStep.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setPasteError = this.setPasteError.bind(this);

    this.errorMessages = [
      { field: "Email", message: "Please enter a valid company email" },
      {
        field: "Phone Number",
        message: "Please enter a valid phone number",
      },
    ];
    this.state = {
      errors: [],
      touched: [],
      action: this.props.customAction ? null : this.props.action,
      stateFieldVisible: false,
      partnerStateFieldVisible: false,
      selectedCountry: "",
      selectedPartnerCountry: this.props.partnerCompanyCountry,
      usPhoneFormat: true,
      partnerUsPhoneFormat:
        this.props.partnerCompanyCountry == "United States" ||
        !this.props.partnerCompanyCountry,
      includeTimeStampInEmailAddress: false,
      submissionInProgress: false,
      submissionAllowed: true,
      fieldsMatchedToStep: false,
      stepEmailFieldValue: null,
      finalStepSubmitted: false,
      clientJSEnabled: false,
      pasteError: null,
    };
  }

  componentDidMount() {
    import("../../data/pardotFormData.json").then((data) => {
      const pardotFormData = data.default;
      // Variables that are initialized here could be moved to the constructor so that all variables are initialized before the first render
      // It would also improve readability slightly

      this.isDealRegistrationForm = this.props.formHandlerID == 3571;
      this.isChannelRequestForm = this.props.formHandlerID == 3709;
      this.isContactForm = this.props.formHandlerID == 3568;
      this.isLandingPageOrWebinarForm =
        this.props.formHandlerID == 3658 || this.props.formHandlerID == 3712;

      // Pass different value to contact_type for contact sales form
      switch (this.props.contactType) {
        case "request_a_demo":
          this.contactTypeValue = "requestDemo";
          break;
        case "contact_sales":
          this.contactTypeValue = "contactSales";
          break;
        case "google_request_a_demo":
          this.contactTypeValue = "googleRequestDemo";
          break;
      }

      const stripQueryStringAndHashFromPath = (url) => {
        return url.split("?")[0].split("#")[0];
      };

      this.pagePath = stripQueryStringAndHashFromPath(window.location.href);
      this.formType = getFormType(this.props.formHandlerID);
      this.setState({
        includeTimeStampInEmailAddress: [
          "dealRegistration",
          "channelRequest",
          "partnerCertification",
        ].includes(this.formType),
      });

      // Get field data corresponding to the form handler ID
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
            !this.isDealRegistrationForm &&
            !isHiddenField(field, this.isChannelRequestForm) &&
            !this.isChannelRequestForm
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
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.formInViewEventPushed) {
              this.formInViewEventPushed = true;
              window.dataLayer?.push({
                event: "pardotFormInView",
              });
            }
          });
        },
        {
          threshold: 0.2,
        }
      );
      if (this.stepsEnabled) {
        observer.observe(this.stepForm);
      } else {
        observer.observe(this.form);
      }
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

  // This function could be split into smaller functions to reduce repetition
  handleCountryChange(newCountryValue, isPartnerCountry) {
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
        // Switch to US phone no. formatting if the previous country did not use it
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
        }
        // Switch to non-US phone no. formatting if the previous country did not use it
        else if (
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

  // Update this.fieldData to only contain the fields that are used in the current step and hidden fields
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
      !this.state.submissionInProgress &&
      !this.assessmentCreatedRef.current &&
      this.state.submissionAllowed
    ) {
      const formData = new FormData(this.form);
      window.dataLayer?.push({
        event: "pardotFormSubmit",
      });
      this.setState({ submissionInProgress: true });
      const token = await grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY,
        { action: "FORM_SUBMISSION" }
      );
      const ip = getCookie("client_ip");
      const domain = formData.get("Email")?.split?.("@")?.[1];
      const clientCountry = getCookie("client_country");
      const client = {
        ip: ip && ip !== "undefined" ? ip : "Unknown",
        country:
          clientCountry && clientCountry !== "undefined"
            ? clientCountry
            : "Unknown",
      };
      [...this.form.getElementsByTagName("input")].forEach((input) => {
        client[input.name] = input.value;
      });
      const validationBody = {
        check: { ip, domain },
        client,
        token,
      };
      let validationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/formValidation`,
        {
          method: "POST",
          body: JSON.stringify(validationBody),
        }
      );
      validationResponse = await validationResponse.json();
      if (!validationResponse.success) {
        this.setState({
          submissionInProgress: false,
          submissionAllowed: false,
        });
        return;
      }
      // Set hidden email field's name to "Email" to include the email step value in the form submission
      if (this.state.stepEmailFieldValue && !this.form["Email"]) {
        this.form["hiddenemail"].name = "Email";
      } else if (
        this.state.includeTimeStampInEmailAddress &&
        this.form["Email"].value
      ) {
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
      // Clear state field values if United States was not the selected country
      // This is for cases where the user first chooses US as their country and also chooses a state, and then changes the country
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
      window.dataLayer?.push({
        event: "pardotFormSuccess",
      });
      if (this.props.customAction) {
        const formObject = Object.fromEntries(formData.entries());
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ajaxRequestPardot`,
          {
            method: "POST",
            body: JSON.stringify({
              endpoint: this.props.action,
              formObject,
            }),
          }
        );
        const data = await response.json();
        this.props.customAction(data.success);
      } else this.form.submit();
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
        // Prevent submission if a visible required field does not have a value
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
                } else if (
                  isFreeEmail(fieldRef.current.value) &&
                  this.isContactForm
                ) {
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
      // check for blocked countries if contact form
      if (this.isContactForm) {
        if (
          fieldRef.current.tagName === "SELECT" &&
          fieldRef.current.name.toLowerCase().includes("country") &&
          blockedContactFormCountries.findIndex(
            (country) => country === fieldRef.current.value
          ) !== -1
        ) {
          this.setState({
            action: "https://info.ujet.cx/l/986641/2022-10-17/l2hy5",
          });
        } else if (
          fieldRef.current.tagName === "SELECT" &&
          fieldRef.current.name.toLowerCase().includes("country") &&
          blockedContactFormCountries.findIndex(
            (country) => country === fieldRef.current.value
          ) === -1
        ) {
          this.setState({
            action: this.props.customAction ? null : this.props.action,
          });
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

  setPasteError(boolean, index) {
    const errors = { ...this.state.errors };
    errors[index] = boolean;
    if (boolean) {
      this.setState({ pasteError: { index, msg: "Can not paste" }, errors });
    } else {
      this.setState({ pasteError: null });
    }
  }
  render() {
    return (
      <>
        <LazyLoadReCAPTCHA />
        {this.stepsEnabled && !this.state.fieldsMatchedToStep ? (
          <form
            className={style.pardotForm}
            ref={(form) => (this.stepForm = form)}
            style={{ display: this.state.clientJSEnabled ? "" : "none" }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            autoComplete={this.isContactForm ? "off" : "on"}
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
                action={this.state.action}
                method={this.props.customAction ? null : "post"}
                onSubmit={(e) => {
                  e.preventDefault();
                  this.handleSubmit(e);
                }}
                autoComplete={this.isContactForm ? "off" : "on"}
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
                    // Perhaps this div could be moved to pardotFormField.jsx as it is the fields' container
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
                          : this.state.errors[index]
                          ? style.error
                          : this.state.touched[index]
                          ? style.valid
                          : ""
                      }
                    >
                      {!isHiddenField(
                        field,
                        this.isDealRegistrationForm === true
                      ) && (
                        <>
                          {index == this.firstPartnerFieldIndex.current && (
                            <p
                              className={`heading-6 ${style["pt-3"]} ${style["mt-3"]} ${style["pb-2"]} ${style["bt-1"]}`}
                            >
                              {this.isDealRegistrationForm
                                ? "Your Information"
                                : this.isChannelRequestForm
                                ? "Partner Information"
                                : null}
                            </p>
                          )}
                          <label htmlFor={field.id}>
                            {field.isRequired && (
                              <span className={style.required}>*</span>
                            )}{" "}
                            {field.name.toLowerCase() === "company"
                              ? "Company Name"
                              : field.name.toLowerCase() === "email"
                              ? "Work Email"
                              : field.name}
                          </label>
                        </>
                      )}
                      <PardotFormField
                        isAssetTitle={this.props.assetTitle}
                        isAssetType={this.props.assetType}
                        isAssetUrl={this.pagePath}
                        contactTypeValue={this.contactTypeValue}
                        isRecordTypeId={this.props.recordTypeId}
                        field={field}
                        isDealRegistrationField={this.isDealRegistrationForm}
                        isContactField={this.isContactForm}
                        /*                         isLandingPageOrWebinarField={
                          this.isLandingPageOrWebinarForm
                        } */
                        isCLPformField={this.props.clpField}
                        isCLSformField={this.props.clsField}
                        isUtmCampaign={this.props.utmCampaign}
                        isUtmAsset={this.props.utmAsset}
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
                        handleCountryChange={this.handleCountryChange}
                        usPhoneFormat={
                          field.name.toLowerCase().match(/partner phone/)
                            ? this.state.partnerUsPhoneFormat
                            : this.state.usPhoneFormat
                        }
                        isContactType={this.props.contactType}
                        partnerFieldProperties={this.getPartnerFieldProperties(
                          field
                        )}
                        setPasteError={(boolean) =>
                          this.setPasteError(boolean, index)
                        }
                      />
                      {this.state.errors[index] && (
                        <FormError
                          message={
                            this.state.pasteError &&
                            this.state.pasteError.index === index
                              ? this.state.pasteError.msg
                              : this.getErrorMessage(field.name)
                          }
                        />
                      )}
                    </div>
                  );
                })}

                {(this.state.includeTimeStampInEmailAddress ||
                  this.state.stepEmailFieldValue) && (
                  <input name="hiddenemail" className="display-none" />
                )}
                <HoneypotFields />
                <div
                  className={`layout mt-4 d-flex flex-direction-column align-items-center`}
                >
                  <input
                    type="submit"
                    className={`button ${
                      this.props.btnColor ? this.props.btnColor : "orange"
                    }`}
                    value={
                      this.state.submissionInProgress
                        ? "Please wait..."
                        : this.props.submit
                    }
                    required="required"
                  />
                  {!this.state.submissionAllowed && (
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
