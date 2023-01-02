import { createRef } from "react";
import { validateField } from "../../utils";
import { pardotFormActions } from "../../reducer";
import {
  addGaData,
  formatPhoneNumber,
  getNextStepIndex,
  isHiddenField,
  reorderFieldData,
} from "../helpers";
import { useFormState } from "./useFormState";

export const useForm = ({ props, pardotFormData, formConfig }) => {
  const { customAction, action } = props;
  const {
    state,
    dispatch,
    formRef,
    fieldRefs,
    isContactForm,
    initialFieldData,
    isChannelRequestForm,
    isDealRegistrationForm,
    handleSetPartnerStateFieldVisible,
    handlePrefilledStepFormCompletion,
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
  } = useFormState({ props, pardotFormData, formConfig });

  const handleSubmit = async (e, stepFormSubmission) => {
    e?.preventDefault?.();
    formValidation(Array(fieldRefs.current.length).fill(true));
    if (stepFormSubmission) {
      formRef.current["hiddenemail"].value = state.stepEmailFieldValue;
      addGaData({
        gaDataAdded: state.gaDataAdded,
        handleSetGaDataAdded,
        formEmailInput: formRef.current["hiddenemail"],
        isDealRegistrationForm,
        formType: state.formType,
        currentStepIndex: state.currentStepIndex,
        isLastStep: props.config.steps.length === state.currentStepIndex + 1,
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
  const setFieldsToMatchStep = (step, currentStepSubmittedFields) => {
    let newFieldData = [...initialFieldData];
    if (step) {
      initialFieldData.forEach((field) => {
        const newFieldDataIndex = newFieldData.findIndex(
          (newField) => field.name === newField.name
        );
        const stepFieldFound = step.find(
          (stepField) => stepField.fields.name === field.name
        );
        const completedFound = currentStepSubmittedFields
          ? currentStepSubmittedFields.find(
              (stepField) =>
                stepField.name === field.name && stepField.submitted
            )
          : false;
        if (
          (completedFound || !stepFieldFound) &&
          !isHiddenField(field, isDealRegistrationForm)
        ) {
          newFieldData.splice(newFieldDataIndex, 1);
        }
      });
      newFieldData = reorderFieldData(newFieldData, state.formType);
    } else {
      // no step found - means that it's the step after all steps have been already submitted
      newFieldData = reorderFieldData(
        newFieldData.filter(
          (field) =>
            isHiddenField(field, isDealRegistrationForm) ||
            field.name === "Email" ||
            field.name === "hiddenemail"
        ),
        state.formType
      );
    }
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
  };

  // checks which of the step form fields are submitted, if any. Returns an array of steps and for each field a 'submitted'
  // property with a boolean value depending on if the field has been previously submitted.
  const checkForSubmittedFields = async (steps, submittedFieldsFromDb) => {
    if (submittedFieldsFromDb) {
      const previouslySubmittedKeys = Object.keys(submittedFieldsFromDb);
      if (previouslySubmittedKeys.length > 0)
        return steps.map((step) => {
          return step.fields.formFields.map((field) => {
            const submittedFound = previouslySubmittedKeys.find(
              (key) => key === field.fields.name
            );
            if (submittedFound) {
              return {
                name: field.fields.name,
                submitted: true,
                value: submittedFieldsFromDb[submittedFound],
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

  // execute required actions when a step form progresses from previous step to the next one.
  const getNextStep = async ({ steps, email }) => {
    let submittedStepFields;
    formRef.current.firstChild.lastChild.focus({ preventScroll: true });

    dispatch({
      type: pardotFormActions.setStepFetchInProgress,
      value: true,
    });

    // fetch previously submitted values for the email.
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

    submittedStepFields = await checkForSubmittedFields(
      steps,
      responseJSON?.submittedFields
    );

    let allStepsSubmitted = false;
    if (submittedStepFields) {
      allStepsSubmitted = steps
        .map((step, i) => {
          return step.fields.formFields.map(
            (field, j) =>
              submittedStepFields[i][j].submitted &&
              field.fields.name === submittedStepFields[i][j].name
          );
        })
        .flat(1)
        .every((value) => value);
    }

    dispatch({
      type: pardotFormActions.setTouchedFields,
      value: Array(fieldRefs.current.length).fill(true),
    });

    // get the index of the next step that has fields to fill. Skip steps that have already been submitted
    const nextStepIndex = getNextStepIndex(
      state.currentStepIndex,
      submittedStepFields
    );
    const currentStep = steps[nextStepIndex]?.fields?.formFields;
    const currentStepSubmittedFields = submittedStepFields
      ? submittedStepFields[nextStepIndex]
      : null;
    dispatch({
      type: pardotFormActions.setCurrentStepIndex,
      value: nextStepIndex,
    });
    formRef.current.reset();
    setFieldsToMatchStep(currentStep, currentStepSubmittedFields);
    if (allStepsSubmitted) {
      formRef.current["hiddenemail"].value = email;
      addGaData({
        gaDataAdded: state.gaDataAdded,
        handleSetGaDataAdded,
        formEmailInput: formRef.current["hiddenemail"],
        isDealRegistrationForm,
        formType: state.formType,
        currentStepIndex: state.currentStepIndex,
        isLastStep: props.config.steps.length === state.currentStepIndex + 1,
      });
      handlePrefilledStepFormCompletion();
      dispatch({
        type: pardotFormActions.setSubmitFlag,
        value: true,
      });
      dispatch({
        type: pardotFormActions.setTouchedFields,
        value: Array(fieldRefs.current.length).fill(true),
      });
    }
  };

  // validate the form to check if there's any input errors.
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
    getNextStep,
    handleSetPasteError,
    formValidation,
    pasteBlocker,
    handleSubmit,
  };
};
