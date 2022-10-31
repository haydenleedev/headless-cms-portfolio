import { addGaData, isHiddenField } from "../../utils/pardotForm";
import style from "./form.module.scss";
import PardotFormContext from "../context";
import { useContext } from "react";
import formConfig from "../form.config";

const FieldResolver = ({ field }) => {
  const {
    setPasteError,
    formValidation,
    handleCountryChange,
    handleSetPartnerStateFieldVisible,
    handleSetTouchedFields,
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

  switch (field.dataFormat) {
    case "email":
      return (
        <input
          hidden={isHiddenField(field, isDealRegistrationField)}
          name={field.name}
          id={field.id}
          autoComplete="email"
          maxLength="255"
          onBlur={() => {
            handleSetTouchedFields();
            formValidation();
            setPasteError(false);
          }}
          onPaste={pasteBlocker}
          onKeyDown={(e) => {
            if (e.code !== "Tab") setPasteError(false);
          }}
          onInput={() => {
            addGaData(
              gaDataAdded,
              updateGaDataAdded,
              fieldRef.current,
              isDealRegistrationField,
              formType,
              contactTypeValue
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
          hidden={isHiddenField(field, isDealRegistrationField)}
          maxLength={usPhoneFormat ? null : 20}
          onBlur={() => {
            handleSetTouchedFields();
            formValidation();
            setPasteError(false);
          }}
          onPaste={pasteBlocker}
          onKeyDown={() => {
            if (usPhoneFormat) {
              phoneNumberFormatter();
            } else formValidation();
            setPasteError(false);
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
          hidden={isHiddenField(field, isDealRegistrationField)}
          onBlur={() => {
            handleSetTouchedFields();
            formValidation();
            setPasteError(false);
          }}
          onKeyDown={(e) => {
            if (e.code !== "Tab") setPasteError(false);
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
              hidden={isHiddenField(field, isDealRegistrationField)}
              onBlur={() => {
                handleSetTouchedFields();
                formValidation();
                setPasteError(false);
              }}
              onKeyDown={(e) => {
                if (e.code !== "Tab") setPasteError(false);
              }}
              ref={fieldRef}
            ></textarea>
          ) : (
            <input
              name={field.name}
              id={field.id}
              maxLength="255"
              hidden={isHiddenField(field, isDealRegistrationField)}
              onBlur={() => {
                handleSetTouchedFields();
                formValidation();
                setPasteError(false);
              }}
              onKeyDown={(e) => {
                if (e.code !== "Tab") setPasteError(false);
              }}
              onPaste={pasteBlocker}
              ref={fieldRef}
              value={
                field.name.toLowerCase() === "contact_type"
                  ? isContactType
                  : field.name.toLowerCase() === "lead record type"
                  ? isRecordTypeId
                  : field.name.toLowerCase() === "asset title"
                  ? isAssetTitle
                  : field.name.toLowerCase() === "asset type"
                  ? isAssetType
                  : field.name.toLowerCase() === "asset url"
                  ? isAssetUrl
                  : /* : field.name.toLowerCase() === "utm_campaign" &&
                    isLandingPageOrWebinarField
                  ? isUtmCampaign
                  : field.name.toLowerCase() === "utm_asset" &&
                    isLandingPageOrWebinarField
                  ? isUtmAsset */
                  field.name.toLowerCase() === "utm_campaign"
                  ? isUtmCampaign
                  : field.name.toLowerCase() === "utm_asset"
                  ? isUtmAsset
                  : field.name.toLowerCase() === "current lead program 2"
                  ? isCLPformField
                  : field.name.toLowerCase() === "current lead source 2"
                  ? isCLSformField
                  : partnerFieldProperties?.value
              }
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
                  handleCountryChange(e.target.value, isPartnerCountry);
                  if (isPartnerCountry) {
                    handleSetPartnerStateFieldVisible(
                      e.target.value == "United States"
                    );
                  } else {
                    updateStateFieldVisible(e.target.value == "United States");
                  }
                }
                handleSetTouchedFields();
                formValidation();
                setPasteError(false);
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
                    updateStateFieldVisible(e.target.value == "United States");
                  }
                }
                handleSetTouchedFields();
                formValidation();
                setPasteError(false);
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
            setPasteError(false);
          }}
          onKeyDown={(e) => {
            if (e.code !== "Tab") setPasteError(false);
          }}
          onPaste={pasteBlocker}
          ref={fieldRef}
        />
      );
  }
};

export default FieldResolver;
