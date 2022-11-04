import { createRef, useEffect, useReducer, useRef, useState } from "react";
import {
  getPartnerFieldProperties,
  submit,
  validateField,
  validSubmitFormModifications,
  verifyFormSubmissionValidity,
} from ".";
import { useIntersectionObserver } from "../../../../utils/hooks";
import { pardotFormActions, pardotFormReducer } from "../reducer";
import {
  addGaData,
  formatPhoneNumber,
  getFallbackFieldData,
  getFormType,
  isHiddenField,
  reorderFieldData,
} from "./helpers";

export const useForm = ({ props, pardotFormData, formConfig }) => {
  const { config, formHandlerID, customAction, partner, action } = props;
  const initialFormState = {
    action: customAction ? null : action,
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
    selectedPartnerCountry: partner?.companyCountry || "",
    usPhoneFormat: true,
    partnerUsPhoneFormat:
      partner?.companyCountry == "United States" || !partner?.companyCountry,
    includeTimeStampInEmailAddress: false,
    submissionInProgress: false,
    submissionAllowed: true,
    fieldsMatchedToStep: false,
    stepEmailFieldValue: null,
    finalStepSubmitted: false,
    clientJSEnabled: false,
    pasteError: null,
    submitFlag: false,
  };

  const isDealRegistrationForm =
    initialFormState.formType === "dealRegistration";
  const isChannelRequestForm = initialFormState.formType === "channelRequest";
  const isContactForm = initialFormState.formType === "contactUs";

  const [state, dispatch] = useReducer(pardotFormReducer, initialFormState);
  const [validForm, setValidForm] = useState(false);
  const fieldRefs = useRef(null);
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
  //<<<<<<<<<<<<< useEffect listeners
  useEffect(() => {
    let fieldData = pardotFormData.find(
      (entry) => entry.formHandlerID === parseInt(formHandlerID)
    ).fieldData;
    const emailFieldExists = fieldData.find((field) => field.name === "Email");
    if (fieldData.length > 0 && emailFieldExists) {
      fieldData.forEach((field) => {
        const shouldBeRequired =
          !isHiddenField(field, isDealRegistrationForm) &&
          !isDealRegistrationForm &&
          !isHiddenField(field, isChannelRequestForm) &&
          !isChannelRequestForm;
        if (shouldBeRequired) {
          field.isRequired = true;
        }
      });
    } else fieldData = getFallbackFieldData(formHandlerID);
    fieldData = reorderFieldData(fieldData, state.formType);
    fieldRefs.current = Array(fieldData.length)
      .fill(0)
      .map(() => createRef());

    dispatch({ type: pardotFormActions.setFieldData, value: fieldData });
    dispatch({
      type: pardotFormActions.setFormErrors,
      value: Array(fieldData.length).fill(false),
    });
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(fieldData.length).fill(false),
    });
    dispatch({
      type: pardotFormActions.setClientJSEnabled,
      value: true,
    });
  }, []);

  useEffect(() => {
    const isValidForm =
      state.touchedFields.length > 0 &&
      state.formErrors.length > 0 &&
      !state.touchedFields.includes(false) &&
      !state.formErrors.includes(true);

    if (isValidForm) setValidForm(true);
    else setValidForm(false);
  }, [state.formErrors]);

  useEffect(() => {
    if (state.stepEmailFieldValue && !state.finalStepSubmitted) {
      formRef.current["hiddenemail"].value = state.stepEmailFieldValue;
      addGaData({
        gaDataAdded: state.gaDataAdded,
        handleSetGaDataAdded,
        formEmailInput: formRef.current["hiddenemail"],
        isDealRegistrationForm,
        formType: state.formType,
      });
    }
  }, [state.stepEmailFieldValue, state.finalStepSubmitted]);

  useEffect(() => {
    const phoneField = formRef.current["Phone Number"];
    if (phoneField) {
      // Switch to US phone no. formatting if the previous country did not use it
      if (formConfig.usPhoneFormatCountries.includes(state.selectedCountry)) {
        dispatch({
          type: pardotFormActions.setUSPhoneFormat,
          value: true,
        });
        phoneField.value = formatPhoneNumber(
          phoneField.value.replace(/\D/g, "")
        );
      }
      // Switch to non-US phone no. formatting if the previous country did not use it
      else {
        dispatch({
          type: pardotFormActions.setUSPhoneFormat,
          value: false,
        });
        phoneField.value = phoneField.value.replace(/\D/g, "");
      }
    }
  }, [state.selectedCountry]);

  useEffect(() => {
    const phoneField = formRef.current["Partner Phone Number"];
    if (phoneField) {
      // Switch to US phone no. formatting if the previous country did not use it
      if (
        formConfig.usPhoneFormatCountries.includes(state.selectedPartnerCountry)
      ) {
        dispatch({
          type: pardotFormActions.setPartnerUSPhoneFormat,
          value: true,
        });
      }
      // Switch to non-US phone no. formatting if the previous country did not use it
      else {
        dispatch({
          type: pardotFormActions.setPartnerUSPhoneFormat,
          value: false,
        });
      }
    }
  }, [state.selectedPartnerCountry]);

  useEffect(() => {
    const submitHandler = async () => {
      const noHoneyName = !formRef.current.honeyname.value;
      const noHoneyEmail = !formRef.current.honeyemail.value;
      const submissionCanProceed =
        !state.submissionInProgress &&
        state.submissionAllowed &&
        noHoneyEmail &&
        noHoneyName;
      if (state.submitFlag && validForm && submissionCanProceed) {
        const formData = new FormData(formRef.current);
        window.dataLayer?.push({
          event: "pardotFormSubmit",
        });
        dispatch({
          type: pardotFormActions.setSubmissionInProgress,
          value: true,
        });

        const validationResponse = await verifyFormSubmissionValidity({
          formRef,
          formData,
        });
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
    try {
      submitHandler();
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: pardotFormActions.setSubmissionInProgress,
        value: false,
      });
    }
  }, [state.submitFlag, validForm]);
  // useEffect listeners >>>>>>>>//

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
    if (partner) return getPartnerFieldProperties({ field, partner });
    return "";
  };

  const handleCountryChange = (newCountryValue) => {
    dispatch(
      {
        type: pardotFormActions.setSelectedCountry,
        value: newCountryValue,
      },
      (state) => console.log(state)
    );
  };

  const handlePartnerCountryChange = (newPartnerCountryValue) => {
    dispatch({
      type: pardotFormActions.setSelectedPartnerCountry,
      value: newPartnerCountryValue,
    });
  };

  // Update fieldData to only contain the fields that are used in the current step and hidden fields
  const setFieldsToMatchStep = (step, emailFieldValue) => {
    const currentStepFields = [...config.items.fields.map((item) => item.name)];
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
      .map(() => createRef());
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
  };

  const formValidation = (newTouchedFields) => {
    const touchedFields = newTouchedFields || state.touchedFields;
    const formErrors = fieldRefs.current.map((fieldRef, index) =>
      validateField({
        fieldData: state.fieldData,
        stateFieldVisible: state.stateFieldVisible,
        partnerStateFieldVisible: state.partnerStateFieldVisible,
        isDealRegistrationForm: isDealRegistrationForm,
        usPhoneFormat: state.usPhoneFormat,
        isContactForm,
        touchedFields,
        customAction,
        handleDispatch,
        fieldRef,
        formRef,
        action,
        index,
      })
    );
    dispatch({ type: pardotFormActions.setSubmitFlag, value: false });
    dispatch({ type: pardotFormActions.setFormErrors, value: formErrors });
  };

  const setPasteError = (boolean, index) => {
    const formErrors = [...state.formErrors];
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

  const phoneNumberFormatter = (index) => {
    const fieldRef = fieldRefs.current[index];
    const field = fieldRef.current;
    if (field.name.toLowerCase().includes("phone")) {
      fieldRef.current.value = formatPhoneNumber(fieldRef.current.value);
    }
  };

  const pasteBlocker = (e, index) => {
    if (isContactForm) {
      e.preventDefault();
      setPasteError(true, index);
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formValidation(Array(fieldRefs.current.length).fill(true));
    dispatch({
      type: pardotFormActions.setSubmitFlag,
      value: true,
    });
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(fieldRefs.current.length).fill(true),
    });
  };
  return {
    state,
    formRef,
    fieldRefs,
    isDealRegistrationForm,
    isChannelRequestForm,
    isContactForm,
    handleDispatch,
    handleSetTouchedFields,
    handleSetGaDataAdded,
    handleSetStateFieldVisible,
    handleSetPartnerStateFieldVisible,
    handleGetPartnerFieldProperties,
    handleCountryChange,
    handlePartnerCountryChange,
    setFieldsToMatchStep,
    phoneNumberFormatter,
    setPasteError,
    formValidation,
    pasteBlocker,
    handleSubmit,
  };
};
