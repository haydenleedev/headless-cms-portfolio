import { createRef } from "react";
import { validateField } from "../../utils";
import { pardotFormActions } from "../../reducer";
import {
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
    handlePrefilledStepFormSubmissionActions,
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
  } = useFormState({ props, pardotFormData, formConfig });

  // called when form is submitted
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
  const updateCurrentStep = async ({ steps, email }) => {
    let submittedStepFields;
    formRef.current.firstChild.lastChild.focus({ preventScroll: true });

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

      submittedStepFields = await checkForSubmittedFields(
        steps,
        responseJSON?.submittedFields
      );

      if (submittedStepFields) {
        dispatch({
          type: pardotFormActions.setSubmittedStepFields,
          value: submittedStepFields,
        });
        const allStepsSubmitted = steps
          .map((step, i) => {
            return step.fields.formFields.map(
              (field, j) =>
                submittedStepFields[i][j].submitted &&
                field.fields.name === submittedStepFields[i][j].name
            );
          })
          .flat(1)
          .every((value) => value);

        if (allStepsSubmitted) {
          handlePrefilledStepFormSubmissionActions(submittedStepFields);
          return;
        }
      }
    } else {
      submittedStepFields = state.submittedStepFields;
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

    // get the index of the next step that has fields to fill. Skip steps that are already fully submitted
    const nextStepIndex = getNextStepIndex(
      state.currentStepIndex,
      submittedStepFields
    );
    if (typeof nextStepIndex === "number") {
      const currentStep = steps[nextStepIndex].fields.formFields;
      const currentStepSubmittedFields = submittedStepFields
        ? submittedStepFields[nextStepIndex]
        : null;
      dispatch({
        type: pardotFormActions.setCurrentStepIndex,
        value: nextStepIndex,
      });
      formRef.current.reset();
      setFieldsToMatchStep(currentStep, currentStepSubmittedFields);
    } else {
      handleSetValidForm(true);
      dispatch({
        type: pardotFormActions.setFinalStepSubmitted,
        value: true,
      });
      dispatch({
        type: pardotFormActions.setSubmitFlag,
        value: true,
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
    updateCurrentStep,
    handleSetPasteError,
    formValidation,
    pasteBlocker,
    handleSubmit,
  };
};
