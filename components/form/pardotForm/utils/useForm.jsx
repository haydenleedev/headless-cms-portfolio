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
    stepEmailFieldValue: null,
    finalStepSubmitted: false,
    clientJSEnabled: false,
    pasteError: null,
    submitFlag: false,
    stepFetchInProgress: false,
    currentStepIndex: -1,
    submittedStepFields: {},
    completedSteps: {},
    stepFormCompleted: false,
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
    if (state.currentStepIndex > 0) {
      formRef.current["hiddenemail"].value = state.stepEmailFieldValue;
      addGaData({
        gaDataAdded: state.gaDataAdded,
        handleSetGaDataAdded,
        formEmailInput: formRef.current["hiddenemail"],
        isDealRegistrationForm,
        formType: state.formType,
      });
    }
  }, [state.currentStepIndex]);

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

  // Update fieldData to only contain the fields that are used in the current step (and hidden fields)
  const setFieldsToMatchStep = (step, submittedFields) => {
    let newFieldData = [...initialFieldData];
    if (step) {
      initialFieldData.forEach((field) => {
        const newFieldDataIndex = newFieldData.findIndex(
          (newField) => field.name === newField.name
        );
        const stepFieldFound = step.find(
          (stepField) => stepField.fields.name === field.name
        );
        if (!stepFieldFound && !isHiddenField(field, isDealRegistrationForm)) {
          newFieldData.splice(newFieldDataIndex, 1);
        }
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
        type: pardotFormActions.setFormErrors,
        value: Array(newFieldData.length).fill(false),
      });
      dispatch({
        type: pardotFormActions.setTouchedFields,
        value: Array(newFieldData.length).fill(false),
      });
    }
    /*     dispatch({
      type: pardotFormActions.setFinalStepSubmitted,
      value: !step,
    }); */
  };

  const checkForSubmittedFields = (associatedStepFields, submittedFields) => {
    let alreadySubmittedStepFields = [];
    Object.keys(submittedFields).forEach((key) => {
      if (associatedStepFields.find((field) => field.name === key))
        alreadySubmittedStepFields.push(submittedFields[key]);
    });
    return alreadySubmittedStepFields;
  };

  const updateCurrentStep = async ({ stepFields, email }) => {
    let submittedFields;
    formRef.current.firstChild.lastChild.focus({ preventScroll: true });
    const currentStep =
      state.currentStepIndex > -1
        ? stepFields[state.currentStepIndex + 1].fields.formFields
        : stepFields[0].fields.formFields;
    // get all fields that are in the step form and compare them to the submitted fields
    const associatedStepFields = stepFields
      .map((step) => step.fields.formFields)
      .flat(1);

    dispatch({
      type: pardotFormActions.setStepFetchInProgress,
      value: true,
    });
    // if email step, fetch submitted field data for the entered email.
    if (state.currentStepIndex === -1 && email) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getSubmittedPardotFields`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
        }
      );
      const responseJSON = await response.json();
      submittedFields = responseJSON ? responseJSON?.submittedFields : {};
      dispatch({
        type: pardotFormActions.setSubmittedStepFields,
        value: responseJSON.submittedFields,
      });
    } else {
      submittedFields = state.submittedStepFields;
    }

    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(fieldRefs.current.length).fill(true),
    });
    dispatch({
      type: pardotFormActions.setCompletedSteps,
      value: {
        ...state.completedSteps,
        ...Object.fromEntries(
          Array.from(new FormData(formRef.current)).filter(
            ([key, value]) => value && key !== "contact_type"
          )
        ),
      },
    });

    /*     const prefilledFields = checkForSubmittedFields(
      associatedStepFields,
      submittedFields
    );

    for (const [key, value] of Object.entries(prefilledFields)) {
      formRef.current.elements.namedItem(key).value = value;
    } */

    dispatch({
      type: pardotFormActions.setCurrentStepIndex,
      value: state.currentStepIndex + 1,
    });
    formRef.current.reset();
    setFieldsToMatchStep(currentStep, submittedFields);
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
    handleSetStepEmailFieldValue,
    handleCountryChange,
    handlePartnerCountryChange,
    phoneNumberFormatter,
    updateCurrentStep,
    setPasteError,
    formValidation,
    pasteBlocker,
    handleSubmit,
  };
};
