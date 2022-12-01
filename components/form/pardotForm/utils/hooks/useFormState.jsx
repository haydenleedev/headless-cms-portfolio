import { useReducer } from "react";
import { pardotFormActions, pardotFormReducer } from "../../reducer";
import { getPartnerFieldProperties } from "../../utils";
import { getFormType } from "../helpers";

export const useFormState = (props) => {
  const { formHandlerID, customAction, partner, action } = props;
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
    dispatch,
    isContactForm,
    isChannelRequestForm,
    isDealRegistrationForm,
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
    handleDispatch,
    pasteBlocker,
  };
};
