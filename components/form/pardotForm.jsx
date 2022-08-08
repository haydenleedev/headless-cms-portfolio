import React, { Component } from "react";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import style from "./form.module.scss";
import FormError from "./formError";
import { isEmail, isPhoneNumber } from "../../shop/utils/validation";
import PardotFormField from "./pardotFormField";
import { getCookie, setCookie } from "../../utils/cookies";
import {
  getFallbackFieldData,
  getFormStep,
  isNonUsPhoneNumber,
  reorderFieldData,
} from "../../utils/pardotForm";
import pardotFormData from "../../data/pardotFormData.json";
import Router from "next/router";
import { boolean } from "../../utils/validation";

class PardotForm extends Component {
  constructor(props) {
    super(props);
    this.stepsEnabled = boolean(this.props.stepsEnabled);
    this.gaDataAdded = React.createRef(false);
    this.updateGaDataAdded = this.updateGaDataAdded.bind(this);
    this.updateSelectedCountry = this.updateSelectedCountry.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTouched = this.updateTouched.bind(this);
    this.updateStateFieldVisible = this.updateStateFieldVisible.bind(this);

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
      selectedCountry: "",
      usPhoneFormat: true,
    };
  }

  componentDidMount() {
    this.form.style.display = "";
    this.isDealRegistrationForm = this.props.formHandlerID == 3571;
    this.pagePath = Router.asPath;
    switch (parseInt(this.props.formHandlerID)) {
      case 3568:
        this.formType = "contactUs";
        break;
      case 3571:
        this.formType = "dealRegistration";
        break;
      case 3658:
        this.formType = "landingPage";
        break;
      case 3709:
        this.formType = "channelRequest";
        break;
      case 3712:
        this.formType = "webinar";
        break;
      case 3715:
        this.formType = "blogSubscription";
        break;
      case 3721:
        this.formType = "googleContact";
        break;
    }

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
      if (this.stepsEnabled) {
        this.currentStep = getFormStep(this.formType);
        this.currentStepFields = [];
        this.stepFields = this.props.config?.items[0].fields || {};
        this.stepFields[
          `${this.formType}Step${this.currentStep}Fields`
        ]?.forEach((item) => {
          this.currentStepFields.push(item.fields.name);
        });
        this.fieldData = this.fieldData.filter((field) => {
          if (
            this.currentStepFields.includes(field.name) ||
            field.name == "Email" ||
            this.isHiddenField(field)
          ) {
            if (!this.isHiddenField(field)) {
              field.isRequired = true;
            }
            return field;
          }
        });
      } else {
        // else if(this.stepsEnabled) {
        this.fieldData.forEach((field) => {
          if (!this.isHiddenField(field) && !this.isDealRegistrationForm) {
            field.isRequired = true;
          }
        });
      } // END if(this.stepsEnabled) {
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

  updateSelectedCountry(newValue) {
    const previousCountry = this.state.selectedCountry;
    const phoneField = this.form["Phone Number"];
    this.setState({ selectedCountry: newValue }, () => {
      if (phoneField) {
        const usPhoneFormatCountries = ["United States", "Canada"];
        if (
          (usPhoneFormatCountries.includes(this.state.selectedCountry) ||
            !this.state.selectedCountry) &&
          !usPhoneFormatCountries.includes(previousCountry) &&
          previousCountry
        ) {
          this.setState({ usPhoneFormat: true }, () => {
            phoneField.value = formatPhoneNumber(
              phoneField.value.replace(/\D/g, "")
            );
            this.validate();
          });
        } else if (
          !usPhoneFormatCountries.includes(this.state.selectedCountry) &&
          this.state.selectedCountry &&
          (usPhoneFormatCountries.includes(previousCountry) || !previousCountry)
        ) {
          this.setState({ usPhoneFormat: false }, () => {
            phoneField.value = phoneField.value.replace(/\D/g, "");
            this.validate();
          });
        }
      }
    });
  }

  isHiddenField(field) {
    // Blacklist hidden fields from Pardot form handler fields
    const hiddenFields = [
      /ga_/,
      /utm_/,
      /current lead/,
      /hidden/,
      /hide/,
      /partner company/,
      /alliance referral/,
      /asset /,
    ];

    const partialHiddenFields = [/partner country/];

    // Check whether form field is blacklisted
    if (
      partialHiddenFields.some(
        (re) =>
          re.test(String(field.name).toLocaleLowerCase()) &&
          this.isDealRegistrationForm
      )
    ) {
      return true;
    } else if (
      hiddenFields.some((re) =>
        re.test(String(field.name).toLocaleLowerCase())
      ) ||
      String(field.name).toLocaleLowerCase() === "partner"
    ) {
      return true;
    }
    return false;
  }

  // START: Define specific field values for deal registration pages
  isPartnerPredefinedField(field, fieldValue) {
    let partnerFieldValue;
    const predefinedValues = [
      { name: "Partner Country" },
      { name: "Partner Company Name" },
      {
        name: "Partner Company State",
      },
      { name: "Partner Company City" },
      {
        name: "Alliance Referral Company",
      },
      { name: "Partner" },
    ];
    predefinedValues.map((item) => {
      if (String(item.name) === String(field.name)) {
        partnerFieldValue = fieldValue;
      }
    });
    return partnerFieldValue;
  }
  // END: Define specific field values for deal registration pages

  async handleSubmit(e) {
    if (
      !this.onSubmitValidate() ||
      this.form.honeyname.value ||
      this.form.honeyemail.value
    ) {
      e.preventDefault();
    } else {
      if (this.isDealRegistrationForm && this.form["Email"].value) {
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
      if (!this.state.stateFieldVisible) {
        [...document.querySelectorAll("[name*=State], [name*=state]")].forEach(
          (element) => {
            if (
              this.form.contains(element) &&
              !this.isHiddenField(element) &&
              ["SELECT", "INPUT"].includes(element.nodeName)
            ) {
              element.value = "";
            }
          }
        );
      }
      if (
        this.stepsEnabled &&
        !getCookie(`${this.formType}Submit${this.currentStep}`)
      ) {
        setCookie(
          `${this.formType}Submit${this.currentStep}`,
          true,
          "Fri, 31 Dec 9999 23:59:59 GMT"
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
        email: this.form["Email"]?.value,
      };
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saveClientData`, {
        method: "POST",
        body: JSON.stringify(clientData),
      });
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
              !this.isHiddenField(fieldRef.current))) &&
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
        <form
          action={this.props.action}
          method="post"
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
          className={style.pardotForm}
          // Hide the form for users with JS disabled
          // display: none is removed in componentDidMount for users with JS enabled
          style={{ display: "none" }}
          ref={(form) => (this.form = form)}
        >
          {this.fieldData?.map((field, index) => {
            return (
              <div
                key={`formField${index}`}
                className={
                  this.isHiddenField(field) ||
                  (field.name.toLowerCase().match(/state/) &&
                    !this.state.stateFieldVisible)
                    ? "display-none"
                    : ""
                }
              >
                {!this.isHiddenField(field) && (
                  <>
                    {field.name.toLowerCase() === "partner full name" && (
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
                  isHiddenField={this.isHiddenField(field)}
                  isDealRegistrationField={this.isDealRegistrationForm}
                  fieldRef={this.fieldRefs[index]}
                  validate={this.validate}
                  updateTouched={() => {
                    this.updateTouched(index);
                  }}
                  gaDataAdded={this.gaDataAdded.current}
                  updateGaDataAdded={this.updateGaDataAdded}
                  updateStateFieldVisible={this.updateStateFieldVisible}
                  updateSelectedCountry={this.updateSelectedCountry}
                  usPhoneFormat={this.state.usPhoneFormat}
                  isPartnerCompanyName={this.isPartnerPredefinedField(
                    field,
                    this.props.partnerCompanyName
                  )}
                  isPartnerCompanyCountry={this.isPartnerPredefinedField(
                    field,
                    this.props.partnerCompanyCountry
                  )}
                  isPartnerCompanyState={this.isPartnerPredefinedField(
                    field,
                    this.props.partnerCompanyState
                  )}
                  isPartnerCompanyCity={this.isPartnerPredefinedField(
                    field,
                    this.props.partnerCompanyCity
                  )}
                  isAllianceReferralCompany={this.isPartnerPredefinedField(
                    field,
                    this.props.allianceReferralCompany
                  )}
                  isPartner={this.isPartnerPredefinedField(
                    field,
                    this.props.partner
                  )}
                />
                {this.state.errors[index] && (
                  <FormError message={this.getErrorMessage(field.name)} />
                )}
              </div>
            );
          })}
          {this.isDealRegistrationForm && (
            <input name="hiddenemail" className="display-none" />
          )}
          {this.pagePath?.includes("/resources/") && (
            <>
              <input name="Asset_URL" type="hidden" value={this.pagePath} />
              <input
                name="Asset_Type"
                className="display-none"
                value={this.pagePath.split("/resources/")[1].split("/")[0]}
              />
              <input
                name="Asset_Title"
                className="display-none"
                value={document.getElementsByTagName("h1")[0].textContent}
              />
            </>
          )}
          {/* START: Honeypot */}
          <label className={style.removehoney} htmlFor="honeyname"></label>
          <input
            className={style.removehoney}
            autoComplete="off"
            type="text"
            id="honeyname"
            name="honeyname"
            tabIndex="-1"
            aria-hidden="true"
          />
          <label className={style.removehoney} htmlFor="honeyemail"></label>
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
          <div className={`layout mt-4`}>
            <input
              type="submit"
              className={`button orange`}
              value={this.props.submit}
              required="required"
            />
          </div>
        </form>
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
