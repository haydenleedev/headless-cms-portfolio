export const pardotFormActions = {
  setFormInViewEventPushed: "set_form_in_view_event_pushed",
  setFirstPartnerFieldIndex: "set_first_partner_field_index",
  setGADataAdded: "set_ga_data_added",
  setStateFieldVisible: "set_state_field_visible",
  setPartnerStateFieldVisible: "set_partner_state_field_visible",
  setFormErrors: "set_form_errors",
  setTouchedFields: "set_touched_fields",
  setSelectedCountry: "set_selected_country",
  setSelectedPartnerCountry: "set_selected_partner_country",
  setUSPhoneFormat: "set_us_phone_format",
  setPartnerUSPhoneFormat: "set_partner_us_phone_format",
  setIncludeTimestampInEmailAddress: "set_include_timestamp_in_email_address",
  setSubmissionInProgress: "set_submission_in_progress",
  setSubmissionAllowed: "set_submission_allowed",
  setFieldsMatchedToStep: "set_fields_matched_to_step",
  setStepEmailFieldValue: "set_step_email_field_value",
  setFinalStepSubmitted: "set_final_step_submitted",
  setClientJSEnabled: "set_client_js_enabled",
  setPasteError: "set_paste_error",
  setFormType: "set_form_type",
  setFieldData: "set_field_data",
};

const setState = (value, key, state) => {
  return { ...state, [key]: value };
};

export function pardotFormReducer(state, action) {
  switch (action.type) {
    case formActions.setFormInViewEventPushed:
      return setState(action.value, "formInViewEventPushed", state);
    case formActions.setFirstPartnerFieldIndex:
      return setState(action.value, "firstPartnerFieldIndex", state);
    case formActions.setGADataAdded:
      return setState(action.value, "gaDataAdded", state);
    case formActions.setStateFieldVisible:
      return setState(action.value, "stateFieldVisible", state);
    case formActions.setPartnerStateFieldVisible:
      return setState(action.value, "partnerStateFieldVisible", state);
    case formActions.setFormErrors:
      return setState(action.value, "formErrors", state);
    case formActions.setTouchedFields:
      return setState(action.value, "touchedFields", state);
    case formActions.setSelectedCountry:
      return setState(action.value, "selectedCountry", state);
    case formActions.setSelectedPartnerCountry:
      return setState(action.value, "selectedPartnerCountry", state);
    case formActions.setUSPhoneFormat:
      return setState(action.value, "usPhoneFormat", state);
    case formActions.setPartnerUSPhoneFormat:
      return setState(action.value, "partnerUsPhoneFormat", state);
    case formActions.setIncludeTimestampInEmailAddress:
      return setState(action.value, "includeTimeStampInEmailAddress", state);
    case formActions.setSubmissionInProgress:
      return setState(action.value, "submissionInProgress", state);
    case formActions.setFieldsMatchedToStep:
      return setState(action.value, "fieldsMatchedToStep", state);
    case formActions.setStepEmailFieldValue:
      return setState(action.value, "stepEmailFieldValue", state);
    case formActions.setFinalStepSubmitted:
      return setState(action.value, "finalStepSubmitted", state);
    case formActions.setClientJSEnabled:
      return setState(action.value, "clientJSEnabled", state);
    case formActions.setPasteError:
      return setState(action.value, "pasteError", state);
    case formActions.setFormType:
      return setState(action.value, "formType", state);
    case formActions.setFieldData:
      return setState(action.value, "fieldData", state);
  }
}
