import PardotFormContext from ".";
import { useForm } from "../utils/useForm";
import pardotFormData from "../../../../data/pardotFormData.json";
import formConfig from "../form.config";

const FormContextProvider = (props) => {
  const { children } = props;
  const {
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
    formValidation,
    pasteBlocker,
    setPasteError,
    handleSubmit,
  } = useForm({ props, pardotFormData, formConfig });

  const context = {
    ...props,
    state,
    formRef,
    fieldRefs,
    isDealRegistrationForm,
    isChannelRequestForm,
    isContactForm,
    pasteBlocker,
    setPasteError,
    handleSetTouchedFields,
    handleSetGaDataAdded,
    handleSetStateFieldVisible,
    handleSetPartnerStateFieldVisible,
    handleGetPartnerFieldProperties,
    handleSetStepEmailFieldValue,
    handleCountryChange,
    phoneNumberFormatter,
    handlePartnerCountryChange,
    updateCurrentStep,
    handleSubmit,
    formValidation,
    handleDispatch,
  };

  return (
    <PardotFormContext.Provider value={context}>
      {children}
    </PardotFormContext.Provider>
  );
};

export default FormContextProvider;
