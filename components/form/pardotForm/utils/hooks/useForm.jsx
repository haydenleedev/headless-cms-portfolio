import { createRef, useEffect, useRef, useState } from "react";
import {
  submit,
  validateField,
  validSubmitFormModifications,
  verifyFormSubmissionValidity,
} from "../../utils";
import { useIntersectionObserver } from "../../../../../utils/hooks";
import { pardotFormActions } from "../../reducer";
import {
  addGaData,
  formatPhoneNumber,
  getFallbackFieldData,
  isHiddenField,
  reorderFieldData,
} from "../helpers";
import { useFormState } from "./useFormState";

export const useForm = ({ props, pardotFormData, formConfig }) => {
  const { formHandlerID, customAction, action } = props;

  const {
    state,
    dispatch,
    isContactForm,
    isChannelRequestForm,
    isDealRegistrationForm,
    handleSetPartnerStateFieldVisible,
    handleGetPartnerFieldProperties,
    handleSetStepEmailFieldValue,
    handlePartnerCountryChange,
    handleSetStateFieldVisible,
    handleSetTouchedFields,
    handleSetGaDataAdded,
    handleSetPasteError,
    handleCountryChange,
    handleDispatch,
    pasteBlocker,
  } = useFormState(props);

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

  // listen for changes to the current step form index.
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

  // Update fieldData to only contain the fields that are used in the current step (and hidden fields)
  const setFieldsToMatchStep = (step, submittedFields) => {
    let newFieldData = [...initialFieldData];
    if (step) {
      initialFieldData.forEach((field, index) => {
        const stepFieldFound = step.find(
          (stepField) => stepField.fields.name === field.name
        );
        if (!stepFieldFound && !isHiddenField(field, isDealRegistrationForm)) {
          newFieldData.splice(index, 1);
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
  };

  const checkForSubmittedFields = async (steps, submittedFields) => {
    const previouslySubmittedKeys = Object.keys(submittedFields);
    if (previouslySubmittedKeys.length > 0) {
      return steps.map((step) => {
        return step.fields.formFields.map((field) => {
          const submittedFound = previouslySubmittedKeys.find(
            (key) => key === field.fields.name
          );
          if (submittedFound) {
            return {
              name: field.fields.name,
              submitted: true,
              value: submittedFields[submittedFound],
            };
          }
          return {
            name: field.fields.name,
            submitted: false,
            value: null,
          };
        });
      });
    }
    return null;
  };

  const updateCurrentStep = async ({ stepFields, email }) => {
    let submittedFields;
    formRef.current.firstChild.lastChild.focus({ preventScroll: true });
    const currentStep =
      state.currentStepIndex > -1
        ? stepFields[state.currentStepIndex + 1].fields.formFields
        : stepFields[0].fields.formFields;

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

      const submittedFields = await checkForSubmittedFields(
        stepFields,
        responseJSON?.submittedFields
      );

      if (submittedFields) {
        dispatch({
          type: pardotFormActions.setSubmittedStepFields,
          value: submittedFields,
        });
        const allStepsSubmitted = stepFields
          .map((step, i) => {
            return step.fields.formFields.map(
              (field, j) =>
                submittedFields[i][j].submitted &&
                field.fields.name === submittedFields[i][j].name
            );
          })
          .flat(1)
          .every((value) => value);

        if (allStepsSubmitted) {
          let completed = submittedFields
            .map((step) =>
              step.map((field) => {
                return { [field.name]: field.value };
              })
            )
            .flat(1);
          completed = completed.reduce(
            (accumulator, currentValue) =>
              Object.assign(accumulator, currentValue),
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
            type: pardotFormActions.setSubmitFlag,
            value: true,
          });
          return;
        }
      }
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

  const phoneNumberFormatter = (index) => {
    const fieldRef = fieldRefs.current[index];
    const field = fieldRef.current;
    if (field.name.toLowerCase().includes("phone")) {
      fieldRef.current.value = formatPhoneNumber(fieldRef.current.value);
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
    handleSetPasteError,
    formValidation,
    pasteBlocker,
    handleSubmit,
  };
};
