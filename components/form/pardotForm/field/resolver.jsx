import style from "../form.module.scss";
import PardotFormContext from "../context";
import { useContext } from "react";
import {
  addGaData,
  isAdditionalSelectField,
  isHiddenField,
  isSelectField,
} from "../utils/helpers";

const FieldResolver = ({ field, index, fieldRef }) => {
  const {
    state,
    contactType,
    assetTitle,
    recordTypeId,
    setPasteError,
    formValidation,
    handleCountryChange,
    handlePartnerCountryChange,
    handleSetPartnerStateFieldVisible,
    handleSetStateFieldVisible,
    handleSetTouchedFields,
    isDealRegistrationForm,
    pasteBlocker,
    handleGetPartnerFieldProperties,
    handleSetGaDataAdded,
    phoneNumberFormatter,
    clpField,
    clsField,
    utmCampaign,
    utmAsset,
    pagePath,
    assetType,
  } = useContext(PardotFormContext);

  // Manually set data format for certain fields, as they are not set correctly in Pardot
  if (isSelectField(field)) {
    field.dataFormat = "select";
  } else if (isAdditionalSelectField(field)) {
    field.dataFormat = "select";
  } else if (field.name.toLowerCase().includes("phone")) {
    field.dataFormat = "phone";
  } else if (field.name.toLowerCase().includes("# of licenses")) {
    field.dataFormat = "number";
  } else if (field.name.toLowerCase().includes("email")) {
    field.dataFormat = "email";
  }

  const resolveInputValue = (field) => {
    const partnerFieldProperties = handleGetPartnerFieldProperties(field);
    const lowerCaseName = field.name.toLowerCase();
    switch (lowerCaseName) {
      case "contact_type":
        return contactType;
      case "lead record type":
        return recordTypeId;
      case "asset title":
        return assetTitle;
      case "asset type":
        return assetType;
      case "asset url":
        return pagePath;
      case "utm_campaign":
        return utmCampaign;
      case "utm_asset":
        return utmAsset;
      case "current lead program 2":
        return clpField;
      case "current lead source 2":
        return clsField;
      default:
        return partnerFieldProperties?.value;
    }
  };

  switch (field.dataFormat) {
    case "email":
      return (
        <input
          hidden={isHiddenField(field, isDealRegistrationForm)}
          name={field.name}
          id={field.id}
          autoComplete="email"
          maxLength="255"
          onBlur={() => {
            handleSetTouchedFields(index);
            formValidation();
            setPasteError(false, index);
          }}
          onPaste={pasteBlocker}
          onKeyDown={(e) => {
            if (e.code !== "Tab") setPasteError(false, index);
          }}
          onInput={() => {
            addGaData(
              state.gaDataAdded,
              handleSetGaDataAdded,
              fieldRef.current,
              isDealRegistrationForm,
              state.formType,
              contactType
            );
          }}
          ref={fieldRef}
        />
      );
    case "phone":
      return (
        <input
          name={field.name}
          id={field.id}
          type="text"
          title={field.name}
          hidden={isHiddenField(field, isDealRegistrationForm)}
          maxLength={state.usPhoneFormat ? null : 20}
          onBlur={() => {
            handleSetTouchedFields(index);
            formValidation();
            setPasteError(false, index);
          }}
          onPaste={pasteBlocker}
          onKeyDown={() => {
            if (state.usPhoneFormat) {
              phoneNumberFormatter(index);
            } else formValidation();
            setPasteError(false, index);
          }}
          ref={fieldRef}
        />
      );
    case "number":
      return (
        <input
          name={field.name}
          id={field.id}
          type="number"
          min="0"
          title={field.name}
          hidden={isHiddenField(field, isDealRegistrationForm)}
          onBlur={() => {
            handleSetTouchedFields(index);
            formValidation();
            setPasteError(false, index);
          }}
          onKeyDown={(e) => {
            if (e.code !== "Tab") setPasteError(false, index);
          }}
          ref={fieldRef}
        />
      );
    case "text":
      return (
        <>
          {field.name.toLowerCase() === "additional details" ||
          field.name.toLowerCase() === "opportunity details" ? (
            <textarea
              name={field.name}
              id={field.id}
              maxLength="232768"
              rows="3"
              hidden={isHiddenField(field, isDealRegistrationForm)}
              onBlur={() => {
                handleSetTouchedFields(index);
                formValidation();
                setPasteError(false, index);
              }}
              onKeyDown={(e) => {
                if (e.code !== "Tab") setPasteError(false, index);
              }}
              ref={fieldRef}
            ></textarea>
          ) : (
            <input
              name={field.name}
              id={field.id}
              maxLength="255"
              hidden={isHiddenField(field, isDealRegistrationForm)}
              onBlur={() => {
                handleSetTouchedFields(index);
                formValidation();
                setPasteError(false, index);
              }}
              onKeyDown={(e) => {
                if (e.code !== "Tab") setPasteError(false, index);
              }}
              onPaste={pasteBlocker}
              ref={fieldRef}
              value={resolveInputValue(field)}
            />
          )}
        </>
      );
    case "select":
      return (
        <>
          {field.options.length > 0 ? (
            <select
              ref={fieldRef}
              name={field.name}
              className={`${
                (field.name.toLowerCase() === "country" || "state") &&
                style["form-select"]
              }`}
              onChange={(e) => {
                if (field.name.toLowerCase().match(/country/)) {
                  const isPartnerCountry = field.name
                    .toLowerCase()
                    .match(/partner/);
                  if (isPartnerCountry) {
                    handlePartnerCountryChange(e.target.value);
                    handleSetPartnerStateFieldVisible(
                      e.target.value == "United States"
                    );
                  } else {
                    handleCountryChange(e.target.value);
                    handleSetStateFieldVisible(
                      e.target.value == "United States"
                    );
                  }
                }
                handleSetTouchedFields(index);
                formValidation();
                setPasteError(false, index);
              }}
              onBlur={(e) => {
                if (field.name.toLowerCase().match(/country/)) {
                  const isPartnerCountry = field.name
                    .toLowerCase()
                    .match(/partner/);
                  handleCountryChange(e.target.value, isPartnerCountry);
                  if (isPartnerCountry) {
                    handleSetPartnerStateFieldVisible(
                      e.target.value == "United States"
                    );
                  } else {
                    handleSetStateFieldVisible(
                      e.target.value == "United States"
                    );
                  }
                }
                handleSetTouchedFields(index);
                formValidation();
                setPasteError(false, index);
              }}
            >
              {field.options.map((option, index) => {
                return (
                  <option
                    key={`selectOption${index}`}
                    value={index == 0 ? "" : option}
                    label={option}
                  ></option>
                );
              })}
            </select>
          ) : null}
        </>
      );
    default:
      return (
        <input
          name={field.name}
          id={field.id}
          maxLength="255"
          onBlur={() => {
            handleSetTouchedFields(index);
            formValidation();
            setPasteError(false, index);
          }}
          onKeyDown={(e) => {
            if (e.code !== "Tab") setPasteError(false, index);
          }}
          onPaste={pasteBlocker}
          ref={fieldRef}
        />
      );
  }
};

export default FieldResolver;
