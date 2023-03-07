import style from "../form.module.scss";
import PardotFormContext from "../context";
import { useContext } from "react";
import {
  addGaData,
  isAdditionalSelectField,
  isHiddenField,
  isSelectField,
  stripQueryStringAndHashFromPath,
} from "../utils/helpers";

const FieldResolver = ({ field, index, fieldRef }) => {
  const {
    state,
    contactType,
    assetTitle,
    recordTypeId,
    handleSetPasteError,
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
    assetType,
  } = useContext(PardotFormContext);

  // Manually set data format for certain fields, as they are not set correctly in Pardot
  if (isSelectField(field)) {
    field.dataFormat = "select";
  } else if (isAdditionalSelectField(field, isDealRegistrationForm)) {
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
        return stripQueryStringAndHashFromPath(window.location.href);
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
            handleSetPasteError(false, index);
          }}
          onPaste={(e) => pasteBlocker(e, index)}
          onKeyDown={(e) => {
            if (e.code !== "Tab") handleSetPasteError(false, index);
          }}
          onInput={() => {
            addGaData({
              gaDataAdded: state.gaDataAdded,
              handleSetGaDataAdded,
              formEmailInput: fieldRef.current,
              isDealRegistrationForm,
              formType: state.formType,
              contactTypeValue: contactType,
            });
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
            handleSetPasteError(false, index);
          }}
          onPaste={(e) => pasteBlocker(e, index)}
          onKeyDown={() => {
            if (state.usPhoneFormat) {
              phoneNumberFormatter(index);
            } else formValidation();
            handleSetPasteError(false, index);
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
          onPaste={(e) => pasteBlocker(e, index)}
          onBlur={() => {
            handleSetTouchedFields(index);
            formValidation();
            handleSetPasteError(false, index);
          }}
          onKeyDown={(e) => {
            if (e.code !== "Tab") handleSetPasteError(false, index);
          }}
          ref={fieldRef}
        />
      );
    case "text":
      if (field.name === "GCLID") {
        return (
          <input
            name={field.name}
            value={
              state.gclidValues?.find?.(
                (value) => parseInt(value.id) === field.id
              )?.value
            }
            id={field.id}
            maxLength="255"
            onBlur={() => {
              handleSetTouchedFields(index);
              formValidation();
              handleSetPasteError(false, index);
            }}
            onKeyDown={(e) => {
              if (e.code !== "Tab") handleSetPasteError(false, index);
            }}
            onPaste={(e) => pasteBlocker(e, index)}
            ref={fieldRef}
          />
        );
      }
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
                handleSetPasteError(false, index);
              }}
              onKeyDown={(e) => {
                if (e.code !== "Tab") handleSetPasteError(false, index);
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
                handleSetPasteError(false, index);
              }}
              onKeyDown={(e) => {
                if (e.code !== "Tab") handleSetPasteError(false, index);
              }}
              onPaste={(e) => pasteBlocker(e, index)}
              ref={fieldRef}
              defaultValue={resolveInputValue(field)}
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
                handleSetPasteError(false, index);
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
                handleSetPasteError(false, index);
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
    default: {
      return (
        <input
          name={field.name}
          id={field.id}
          maxLength="255"
          onBlur={() => {
            handleSetTouchedFields(index);
            formValidation();
            handleSetPasteError(false, index);
          }}
          onKeyDown={(e) => {
            if (e.code !== "Tab") handleSetPasteError(false, index);
          }}
          onPaste={(e) => pasteBlocker(e, index)}
          ref={fieldRef}
        />
      );
    }
  }
};

export default FieldResolver;
