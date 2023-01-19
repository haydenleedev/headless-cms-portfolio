import {
  isEmail,
  isFreeEmail,
  isPhoneNumber,
} from "../../../../shop/utils/validation";
import { getCookie } from "../../../../utils/cookies";
import config from "../form.config";
import { pardotFormActions } from "../reducer";
import {
  addGclid,
  formatPhoneNumber,
  isHiddenField,
  isNonUsPhoneNumber,
} from "./helpers";

// this function checks for validation errors on a form field
export const validateField = ({
  fieldData,
  stateFieldVisible,
  partnerStateFieldVisible,
  isDealRegistrationForm,
  handleDispatch,
  usPhoneFormat,
  isContactForm,
  touchedFields,
  customAction,
  fieldRef,
  action,
  index,
}) => {
  if (fieldRef.current) {
    const fieldIsTouched = touchedFields[index];
    const fieldName = fieldRef.current.name;
    let hasError = false;
    // Prevent submission if a visible required field does not have a value
    if (fieldIsTouched) {
      const isRequiredField = fieldData[index];

      // field is required but isn't a state select input
      const isRequiredNotStateField =
        fieldData[index]?.isRequired && !fieldName.toLowerCase().match(/state/);

      // field is a visible state select input
      const isVisibleStateField =
        stateFieldVisible &&
        fieldName.toLowerCase().match(/state/) &&
        !fieldName.toLowerCase().match(/partner/) &&
        !isHiddenField(fieldRef.current, isDealRegistrationForm);

      // field is a visible partner state select input
      const isVisiblePartnerStateField =
        partnerStateFieldVisible &&
        fieldName.toLowerCase().match(/state/) &&
        fieldName.toLowerCase().match(/partner/) &&
        !isHiddenField(fieldRef.current, isDealRegistrationForm);

      // field has a value
      const fieldValue = fieldRef.current?.value;

      // field has a value, but it's a number input and the value is less than 1
      const isNumberFieldWithInvalidValue =
        fieldRef.current.type === "number" && fieldValue < 1;

      if (
        (isRequiredNotStateField ||
          isVisibleStateField ||
          isVisiblePartnerStateField) &&
        !fieldValue
      ) {
        // check for invalid state select input values
        hasError = true;
      } else if (isNumberFieldWithInvalidValue) {
        // check for invalid number input values
        hasError = true;
      } else if (fieldValue) {
        // if the previous conditions didn't apply, check for invalid input values in general
        switch (fieldName) {
          case "Phone Number": {
            if (usPhoneFormat) {
              if (!isPhoneNumber(formatPhoneNumber(fieldValue))) {
                hasError = true;
              }
            } else if (!isNonUsPhoneNumber(fieldValue)) {
              hasError = true;
            }
            break;
          }
          case "Email": {
            if (!isEmail(fieldValue)) {
              hasError = true;
            } else if (isFreeEmail(fieldValue) && isContactForm) {
              hasError = true;
            }
            break;
          }
          default: {
            if (!Boolean(fieldValue) && isRequiredField) {
              hasError = true;
            }
            break;
          }
        }
      }

      // finally check for blocked countries if contact form and change action attribute accordingly.
      if (isContactForm) {
        if (
          fieldRef.current.tagName === "SELECT" &&
          fieldRef.current.name.toLowerCase().includes("country") &&
          config.blockedContactFormCountries.findIndex(
            (country) => country === fieldRef.current.value
          ) !== -1
        ) {
          handleDispatch({
            type: pardotFormActions.setAction,
            value: "https://info.ujet.cx/l/986641/2022-10-17/l2hy5",
          });
        } else if (
          fieldRef.current.tagName === "SELECT" &&
          fieldRef.current.name.toLowerCase().includes("country") &&
          config.blockedContactFormCountries.findIndex(
            (country) => country === fieldRef.current.value
          ) === -1
        ) {
          handleDispatch({
            type: pardotFormActions.setAction,
            value: customAction ? null : action,
          });
        }
      }
    }
    return hasError;
  }
};

// Define specific field values for deal registration pages
export const getPartnerFieldProperties = ({ field, partner }) => {
  const partnerFieldData = [
    { name: "Partner Country", value: partner.companyCountry },
    { name: "Partner Company Name", value: partner.companyName },
    { name: "Partner Company State", value: partner.companyState },
    { name: "Partner Company City", value: partner.companyCity },
    {
      name: "Alliance Referral Company",
      value: partner.allianceReferralCompany,
    },
    { name: "Partner", value: partner.partnerId },
  ];
  return partnerFieldData.find((item) => item.name === field.name);
};

// verify that the user hasn't been blocked by recaptcha or by matching blacklisted ip / email domain.
export const verifyFormSubmissionValidity = async ({ formRef, formData }) => {
  try {
    const token = await grecaptcha.enterprise.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY,
      { action: "FORM_SUBMISSION" }
    );
    const ip = getCookie("client_ip");
    const domain = formData.get("Email")?.split?.("@")?.[1];
    const clientCountry = getCookie("client_country");
    const client = {
      ip: ip && ip !== "undefined" ? ip : "Unknown",
      clientCountry:
        clientCountry && clientCountry !== "undefined"
          ? clientCountry
          : "Unknown",
    };
    [
      ...formRef.current.getElementsByTagName("input"),
      ...formRef.current.getElementsByTagName("select"),
    ].forEach((input) => {
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
    return await validationResponse.json();
  } catch (error) {
    console.error(error.message);
  }
};

// if the form is valid for submission, execute some modifications to it before submitting.
export const validSubmitFormModifications = ({
  includeTimeStampInEmailAddress,
  partnerStateFieldVisible,
  isDealRegistrationForm,
  stepEmailFieldValue,
  stateFieldVisible,
  formRef,
}) => {
  // get gclid values
  addGclid();
  // Set hidden email field's name to "Email" to include the email step value in the form submission
  if (stepEmailFieldValue && !formRef.current["Email"]) {
    formRef.current["hiddenemail"].name = "Email";
  } else if (includeTimeStampInEmailAddress && formRef.current["Email"].value) {
    const splitEmail = formRef.current["Email"].value.split(/(@)/);
    const date = new Date();
    const timestampedEmail = `${splitEmail[0]}+ex${date.getTime()}${
      splitEmail[1]
    }${splitEmail[2]}`;
    // Set hidden email field's name to "Email" to prevent users from seeing the timestamped email
    const hiddenEmailField = formRef.current["hiddenemail"];
    hiddenEmailField.value = timestampedEmail;
    formRef.current["Email"].name = "";
    hiddenEmailField.name = "Email";
  }
  // Clear state field values if United States was not the selected country
  // This is for cases where the user first chooses US as their country and also chooses a state, and then changes the country
  if (!stateFieldVisible || !partnerStateFieldVisible) {
    [...document.querySelectorAll("[name*=State], [name*=state]")].forEach(
      (element) => {
        if (
          formRef.current.contains(element) &&
          !isHiddenField(element, isDealRegistrationForm)
        ) {
          if (
            ((!stateFieldVisible &&
              !element.name.toLowerCase().match(/partner/)) ||
              (!partnerStateFieldVisible &&
                element.name.toLowerCase().match(/partner/))) &&
            ["SELECT", "INPUT"].includes(element.nodeName)
          ) {
            element.value = "";
          }
        }
      }
    );
  }
};

// determine what to do when the form is submitted.
export const submit = async ({ customAction, formData, formRef, action }) => {
  // instead of normal form submission, trigger the prefilledStepFormAction function
  // if the form has a customAction (e.g. BlogSubcriptionBanner)
  if (customAction) {
    const formObject = Object.fromEntries(formData.entries());
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ajaxRequestPardot`,
      {
        method: "POST",
        body: JSON.stringify({
          endpoint: action,
          formObject,
        }),
      }
    );
    const data = await response.json();
    customAction(data.success);
    // normal form submission.
  } /* else formRef.current.submit(); */
};
