import PardotFormContext from ".";
import { useEffect, useRef } from "react";
import { pardotFormActions, pardotFormReducer } from "../reducer";
import pardotFormData from "../../../../data/pardotFormData.json";
import formConfig from "../form.config";
import {
  addGaData,
  getFallbackFieldData,
  getFormType,
  isHiddenField,
  reorderFieldData,
} from "../utils/helpers";
import {
  getPartnerFieldProperties,
  submit,
  validateField,
  validSubmitFormModifications,
  verifyFormSubmissionValidity,
} from "../utils";
import { useIntersectionObserver } from "../../../../utils/hooks";

// using React Context and useReducer for cleaner handling of form data
const FormContextProvider = ({
  config,
  formHandlerID,
  stepsEnabled,
  customAction,
  contactType,
  children,
  partner,
  action,
}) => {
  const formState = {
    fieldData: [],
    formType: getFormType(formHandlerID),
    formErrors: [],
    touchedFields: [],
    gaDataAdded: false,
    formInViewEventPushed: false,
    firstPartnerFieldIndex: null,
    stateFieldVisible: false,
    partnerStateFieldVisible: false,
    selectedCountry: "",
    selectedPartnerCountry: props.partnerCompanyCountry,
    usPhoneFormat: true,
    partnerUsPhoneFormat:
      props.partnerCompanyCountry == "United States" ||
      !props.partnerCompanyCountry,
    includeTimeStampInEmailAddress: false,
    submissionInProgress: false,
    submissionAllowed: true,
    fieldsMatchedToStep: false,
    stepEmailFieldValue: null,
    finalStepSubmitted: false,
    clientJSEnabled: false,
    pasteError: null,
  };
  const fieldRefs = useRef(null);
  const [state, dispatch] = useReducer(pardotFormReducer, formState);
  const formRef = useIntersectionObserver(null, 0.2, () => {
    if (state.formInViewEventPushed) {
      dispatch({
        type: pardotFormActions.setFormInViewEventPushed,
        value: true,
      });
      window.dataLayer?.push({
        event: "pardotFormInView",
      });
    }
  });

  // initialize form
  useEffect(() => {
    let fieldData = pardotFormData.find(
      (entry) => entry.formHandlerID === parseInt(formHandlerID)
    );
    const emailFieldExists = fieldData.find((field) => field.name === "Email");
    if (fieldData.length > 0 && emailFieldExists) {
      fieldData.forEach((field) => {
        const shouldBeRequired =
          !isHiddenField(field, this.isDealRegistrationForm) &&
          !this.isDealRegistrationForm &&
          !isHiddenField(field, this.isChannelRequestForm) &&
          !this.isChannelRequestForm;
        if (shouldBeRequired) {
          field.isRequired = true;
        }
      });
    } else fieldData = getFallbackFieldData(this.props.formHandlerID);
    fieldData = reorderFieldData(this.fieldData, this.formType);
    fieldRefs.current = Array(fieldData.length)
      .fill(0)
      .map(() => React.createRef());

    dispatch({ type: pardotFormActions.setFieldData, value: fieldData });
    dispatch({
      type: pardotFormActions.setFormErrors,
      value: Array(this.fieldData.length).fill(false),
    });
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(this.fieldData.length).fill(false),
    });
    dispatch({
      type: pardotFormActions.setClientJSEnabled,
      value: true,
    });
  }, []);

  const handleDispatch = ({ type, value }) => {
    dispatch({ type, value });
  };

  const handleSetTouchedFields = (index) => {
    const touchedFields = state.touchedFields;
    touchedFields[index] = true;
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: touchedFields,
    });
  };

  const handleSetGaDataAdded = (value) => {
    dispatch({
      type: pardotFormActions.setGADataAdded,
      value,
    });
  };

  const handleSetStateFieldVisible = (value) => {
    dispatch({
      type: pardotFormActions.setStateFieldVisible,
      value,
    });
  };

  const handleSetPartnerStateFieldVisible = (value) => {
    dispatch({
      type: pardotFormActions.setPartnerStateFieldVisible,
      value,
    });
  };

  const handleGetPartnerFieldProperties = (field) => {
    return getPartnerFieldProperties({ field, partner });
  };

  const handleCountryChange = (newCountryValue) => {
    const previousCountry = state.selectedCountry;
    const phoneField = formRef.current["Phone Number"];
    dispatch({
      type: pardotFormActions.setSelectedCountry,
      value: newCountryValue,
    });
    if (phoneField) {
      // Switch to US phone no. formatting if the previous country did not use it
      if (
        (formConfig.usPhoneFormatCountries.includes(newCountryValue) ||
          !newCountryValue) &&
        !formConfig.usPhoneFormatCountries.includes(previousCountry) &&
        previousCountry
      ) {
        dispatch({ type: pardotFormActions.setUSPhoneFormat, value: true });
      }
      // Switch to non-US phone no. formatting if the previous country did not use it
      else if (
        !formConfig.usPhoneFormatCountries.includes(newCountryValue) &&
        state.selectedCountry &&
        (formConfig.usPhoneFormatCountries.includes(previousCountry) ||
          !previousCountry)
      ) {
        dispatch({ type: pardotFormActions.setUSPhoneFormat, value: false });
      }
    }
  };

  const handlePartnerCountryChange = (newPartnerCountryValue) => {
    const previousCountry = state.selectedPartnerCountry;
    const phoneField = formRef.current["Partner Phone Number"];
    dispatch({
      type: pardotFormActions.setSelectedPartnerCountry,
      value: newPartnerCountryValue,
    });
    if (phoneField) {
      // Switch to US phone no. formatting if the previous country did not use it
      if (
        (formConfig.usPhoneFormatCountries.includes(newPartnerCountryValue) ||
          !newPartnerCountryValue) &&
        !formConfig.usPhoneFormatCountries.includes(previousCountry) &&
        previousCountry
      ) {
        dispatch({
          type: pardotFormActions.setPartnerUSPhoneFormat,
          value: true,
        });
      }
      // Switch to non-US phone no. formatting if the previous country did not use it
      else if (
        !formConfig.usPhoneFormatCountries.includes(newPartnerCountryValue) &&
        state.selectedPartnerCountry &&
        (formConfig.usPhoneFormatCountries.includes(previousCountry) ||
          !previousCountry)
      ) {
        dispatch({ type: pardotFormActions.setUSPhoneFormat, value: false });
      }
    }
  };

  // Update fieldData to only contain the fields that are used in the current step and hidden fields
  const setFieldsToMatchStep = (step, emailFieldValue) => {
    const currentStepFields = [...config.items.fields.map((item) => item.name)];
    const isDealRegistrationForm = state.formType === "dealRegistration";
    let newFieldData = [...state.fieldData]
      .map((field) => {
        if (
          currentStepFields.includes(field.name) &&
          !isHiddenField(field, isDealRegistrationForm)
        ) {
          field.isRequired = true;
        }
      })
      .filter(
        (field) =>
          currentStepFields.includes(field.name) ||
          isHiddenField(field, isDealRegistrationForm)
      );
    newFieldData = reorderFieldData(newFieldData, state.formType);
    fieldRefs.current = Array(state.fieldData.length)
      .fill(0)
      .map(() => React.createRef());
    dispatch({
      type: pardotFormActions.setFormErrors,
      value: Array(state.fieldData.length).fill(false),
    });
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(state.fieldData.length).fill(false),
    });
    dispatch({
      type: pardotFormActions.setFieldsMatchedToStep,
      value: true,
    });
    dispatch({
      type: pardotFormActions.setStepEmailFieldValue,
      value: emailFieldValue,
    });
    dispatch({
      type: pardotFormActions.setFinalStepSubmitted,
      value: !step,
    });
    if (state.stepEmailFieldValue && !state.finalStepSubmitted) {
      formRef.current["hiddenemail"].value = state.stepEmailFieldValue;
      addGaData(
        state.gaDataAdded,
        handleSetGaDataAdded,
        formRef.current["hiddenemail"],
        isDealRegistrationForm,
        state.formType
      );
    }
  };

  const formValidation = ({ submitFlag = false }) => {
    const touchedFields = submitFlag
      ? Array(fieldRefs.current.length).fill(true)
      : state.touchedFields;
    const formErrors = Array(fieldRefs.current.length).fill(false);
    fieldRefs.current.forEach((fieldRef, index) => {
      const errors = validateField({
        fieldData: state.fieldData,
        stateFieldVisible: state.stateFieldVisible,
        partnerStateFieldVisible: state.partnerStateFieldVisible,
        isDealRegistrationForm: state.isDealRegistrationForm,
        usPhoneFormat: state.usPhoneFormat,
        isContactForm: state.formType === "contactUs",
        touchedFields,
        customAction,
        formErrors,
        fieldRef,
        formRef,
        action,
        index,
      });
      dispatch({ type: pardotFormActions.setFormErrors, value: errors });
    });
    return !state.formErrors.includes(true);
  };

  const submitValidation = () => {
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(fieldRefs.current.length).fill(true),
    });
    const flag = formValidation({ submitFlag: true });
    return flag;
  };

  const setPasteError = (boolean, index) => {
    const formErrors = { ...state.formErrors };
    formErrors[index] = boolean;
    if (boolean) {
      dispatch({
        type: pardotFormActions.setPasteError,
        value: { index, msg: "Can not paste" },
      });
      dispatch({ type: pardotFormActions.setFormErrors, value: formErrors });
    } else {
      dispatch({
        type: pardotFormActions.setPasteError,
        value: null,
      });
    }
  };

  const phoneNumberFormatter = () => {
    if (field.name.toLowerCase().includes("phone")) {
      fieldRef.current.value = formatPhoneNumber(fieldRef.current.value);
    }
  };

  const pasteBlocker = (e) => {
    if (isContactField) {
      e.preventDefault();
      setPasteError(true);
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validForm = submitValidation();
    const noHoneyName = !formRef.current.honeyname.value;
    const noHoneyEmail = !formRef.current.honeyemail.value;
    const submissionCanProceed =
      !state.submissionInProgress &&
      state.submissionAllowed &&
      noHoneyEmail &&
      noHoneyName;
    if (validForm && submissionCanProceed) {
      const formData = new FormData(formRef.current);
      window.dataLayer?.push({
        event: "pardotFormSubmit",
      });
      dispatch({
        type: pardotFormActions.setSubmissionInProgress,
        value: true,
      });

      const validationResponse = await verifyFormSubmissionValidity();
      if (!validationResponse.success) {
        dispatch({
          type: pardotFormActions.setSubmissionInProgress,
          value: false,
        });
        dispatch({
          type: pardotFormActions.setSubmissionAllowed,
          value: false,
        });
        return;
      }
      const isDealRegistrationForm =
        getFormType(state.formType) === "dealRegistration";
      validSubmitFormModifications({
        includeTimeStampInEmailAddress: state.includeTimeStampInEmailAddress,
        partnerStateFieldVisible: state.partnerStateFieldVisible,
        stepEmailFieldValue: state.stepEmailFieldValue,
        stateFieldVisible: state.stateFieldVisible,
        isDealRegistrationForm,
        formRef,
      });
      window.dataLayer?.push({
        event: "pardotFormSuccess",
      });
      submit({ customAction, formData, formRef, action });
    }
  };

  const context = {
    state,
    formRef,
    contactType,
    stepsEnabled,
    formHandlerID,
    handleSetTouchedFields,
    handleSetGaDataAdded,
    handleSetStateFieldVisible,
    handleSetPartnerStateFieldVisible,
    handleGetPartnerFieldProperties,
    handleCountryChange,
    phoneNumberFormatter,
    handlePartnerCountryChange,
    setFieldsToMatchStep,
    setPasteError,
    handleSubmit,
    formValidation,
    handleDispatch,
    pasteBlocker,
  };

  return (
    <PardotFormContext.Provider value={context}>
      {children}
    </PardotFormContext.Provider>
  );
};

export default FormContextProvider;
