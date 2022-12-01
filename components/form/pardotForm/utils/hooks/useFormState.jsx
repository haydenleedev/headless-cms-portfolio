import {
  submit,
  validSubmitFormModifications,
  verifyFormSubmissionValidity,
} from "../../utils";
import { useReducer, createRef, useEffect, useState, useRef } from "react";
import { pardotFormActions, pardotFormReducer } from "../../reducer";
import { useIntersectionObserver } from "../../../../../utils/hooks";
import { getPartnerFieldProperties } from "../../utils";
import {
  getFormType,
  addGaData,
  formatPhoneNumber,
  getFallbackFieldData,
  isHiddenField,
  reorderFieldData,
} from "../helpers";

export const useFormState = ({ props, pardotFormData, formConfig }) => {
  const { formHandlerID, customAction, partner, action, stepCompletion } =
    props;
  const initialFormState = {
    action: customAction ? null : action, // the Pardot form submission endpoint that will be requested when the form is successfully submitted.
    fieldData: [], // an array which contains the data of all the form fields received from Pardot.
    formType: getFormType(formHandlerID), // defines the type of the form based on it's form handler ID (found in the url of the Pardot form handler)
    formErrors: [], // lists of boolean values which has equal length with the fieldData array. If some field has an error, the matching boolean value is true.
    touchedFields: [], // lists of boolean values which has equal length with the fieldData array. If some field has been touched, the matching boolean value is true.
    gaDataAdded: false, // flag for determining if the addGaData function has been triggered already.
    formInViewEventPushed: false, // flag for determining if the pardotFormInView event has been pushed to GTM data layer already.
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
    stepEmailFieldValue: null,
    finalStepSubmitted: false,
    clientJSEnabled: false,
    pasteError: null,
    submitFlag: false,
    stepFetchInProgress: false,
    currentStepIndex: -1, // initially -1 because the first step where email is submitted is not considered as a step
    submittedStepFields: {},
    completedSteps: {},
    prefilledCompletionView: false,
    prefilledStepFormCompleted: false,
  };
  const isDealRegistrationForm =
    initialFormState.formType === "dealRegistration";
  const isChannelRequestForm = initialFormState.formType === "channelRequest";
  const isContactForm = initialFormState.formType === "contactUs";

  const [state, dispatch] = useReducer(pardotFormReducer, initialFormState);

  const [initialFieldData, setInitialFieldData] = useState(null); // needed for step form logic: used to compare active step fields to original field data
  const [validForm, setValidForm] = useState(false);
  const fieldRefs = useRef(null);
  const formRef = useIntersectionObserver(null, 0.2, () => {
    if (!state.formInViewEventPushed) {
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
  // initialize the form.
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

    setInitialFieldData(fieldData);
    dispatch({
      type: pardotFormActions.setIncludeTimestampInEmailAddress,
      value: [
        "dealRegistration",
        "channelRequest",
        "partnerCertification",
      ].includes(state.formType),
    });
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

  // listen for changes to form errors list. Check if the form is valid.
  useEffect(() => {
    const isValidForm =
      state.touchedFields.length > 0 &&
      state.formErrors.length > 0 &&
      !state.touchedFields.includes(false) &&
      !state.formErrors.includes(true);

    if (isValidForm) setValidForm(true);
    else setValidForm(false);
  }, [state.formErrors]);

  // listen for changes to the 'final step submitted' flag.
  useEffect(() => {
    if (state.finalStepSubmitted) {
      formRef.current["hiddenemail"].value = state.stepEmailFieldValue;
      addGaData({
        gaDataAdded: state.gaDataAdded,
        handleSetGaDataAdded,
        formEmailInput: formRef.current["hiddenemail"],
        isDealRegistrationForm,
        formType: state.formType,
      });
    }
  }, [state.finalStepSubmitted]);

  // listen to changes on the selected country. Change phone number format for US or Canada
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

  // listen to changes on the selected partner country. Change phone number format for US Canada
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

  // check for form submission events. Submit only if the submitFlag is active and the form is valid.
  useEffect(() => {
    const submitHandler = async () => {
      const noHoneyName = !formRef.current?.honeyname?.value;
      const noHoneyEmail = !formRef.current?.honeyemail?.value;
      const submissionCanProceed =
        !state.submissionInProgress &&
        state.submissionAllowed &&
        noHoneyEmail &&
        noHoneyName;
      if (state.submitFlag && validForm && submissionCanProceed) {
        dispatch({
          type: pardotFormActions.setSubmissionInProgress,
          value: true,
        });
        if (state.finalStepSubmitted) {
          for (let key in state.completedSteps) {
            const prefilled = document.createElement("input");
            prefilled.setAttribute("name", key);
            prefilled.setAttribute("value", state.completedSteps[key]);
            const fieldNameAlreadyExists = formRef.current.querySelector(
              `input[name="${key}"]`
            );
            if (fieldNameAlreadyExists)
              formRef.current.removeChild(fieldNameAlreadyExists.parentElement);
            formRef.current.appendChild(prefilled);
          }
        }
        const formData = new FormData(formRef.current);
        window.dataLayer?.push({
          event: "pardotFormSubmit",
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
        submit({
          customAction,
          formData,
          formRef,
          action,
          prefilledStepFormAction:
            stepCompletion && state.prefilledStepFormCompleted
              ? handlePrefilledStepFormCompletion
              : "",
        });
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

  // <<<<<<<<< handlers
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
    dispatch({
      type: pardotFormActions.setSelectedCountry,
      value: newCountryValue,
    });
  };

  const handlePartnerCountryChange = (newPartnerCountryValue) => {
    dispatch({
      type: pardotFormActions.setSelectedPartnerCountry,
      value: newPartnerCountryValue,
    });
  };

  const handleSetStepEmailFieldValue = (email) => {
    dispatch({
      type: pardotFormActions.setStepEmailFieldValue,
      value: email,
    });
  };

  const handlePrefilledStepFormCompletion = () => {
    dispatch({
      type: pardotFormActions.setPrefilledCompletionView,
      value: true,
    });
  };

  const handleSetValidForm = (boolean) => {
    setValidForm(boolean);
  };

  const handleSetPasteError = (boolean, index) => {
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

  // a set of actions that are triggered when the user submits a step form for which all field values were found from the db.
  const handlePrefilledStepFormSubmissionActions = (submittedStepFields) => {
    let completed = submittedStepFields
      .map((step) =>
        step.map((field) => {
          return { [field.name]: field.value };
        })
      )
      .flat(1);
    completed = completed.reduce(
      (accumulator, currentValue) => Object.assign(accumulator, currentValue),
      {}
    );
    let newFieldData = [...initialFieldData];
    initialFieldData.forEach((field) => {
      const shouldBeDeletedIndex = newFieldData.findIndex(
        (compareField) =>
          compareField.name === field.name &&
          !isHiddenField(compareField, isDealRegistrationForm)
      );
      if (shouldBeDeletedIndex !== -1)
        newFieldData.splice(shouldBeDeletedIndex, 1);
    });
    newFieldData = reorderFieldData(newFieldData, state.formType);
    dispatch({
      type: pardotFormActions.setStepFetchInProgress,
      value: false,
    });
    fieldRefs.current = Array(newFieldData.length)
      .fill(0)
      .map(() => createRef());
    dispatch({
      type: pardotFormActions.setFieldData,
      value: newFieldData,
    });
    dispatch({
      type: pardotFormActions.setCurrentStepIndex,
      value: state.currentStepIndex + 1,
    });
    dispatch({
      type: pardotFormActions.setCompletedSteps,
      value: completed,
    });
    setValidForm(true);
    dispatch({
      type: pardotFormActions.setFinalStepSubmitted,
      value: true,
    });
    dispatch({
      type: pardotFormActions.setPrefilledStepFormCompleted,
      value: true,
    });
    dispatch({
      type: pardotFormActions.setSubmitFlag,
      value: true,
    });
  };

  const handleSubmit = async (e, stepsDone) => {
    e.preventDefault();
    formValidation(Array(fieldRefs.current.length).fill(true));
    if (stepsDone) {
      dispatch({
        type: pardotFormActions.setFinalStepSubmitted,
        value: true,
      });
    }
    dispatch({
      type: pardotFormActions.setSubmitFlag,
      value: true,
    });
    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(fieldRefs.current.length).fill(true),
    });
  };
  // handlers >>>>>>>>>

  const pasteBlocker = (e, index) => {
    if (isContactForm) {
      e.preventDefault();
      handleSetPasteError(true, index);
      return false;
    } else {
      return true;
    }
  };

  return {
    state,
    formRef,
    dispatch,
    fieldRefs,
    validForm,
    fieldRefs,
    isContactForm,
    initialFieldData,
    isChannelRequestForm,
    isDealRegistrationForm,
    handlePrefilledStepFormSubmissionActions,
    handlePrefilledStepFormCompletion,
    handleSetPartnerStateFieldVisible,
    handleGetPartnerFieldProperties,
    handleSetStepEmailFieldValue,
    handlePartnerCountryChange,
    handleSetStateFieldVisible,
    handleSetTouchedFields,
    handleSetGaDataAdded,
    handleSetPasteError,
    handleCountryChange,
    handleSetValidForm,
    handleDispatch,
    pasteBlocker,
  };
};
