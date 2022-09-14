import { formatPhoneNumber } from "../../shop/utils/formatData";
import { addGaData, isHiddenField } from "../../utils/pardotForm";
import {
  countries,
  crmSolutions,
  employees,
  states,
  preferredMasterAgent,
  partnerAreaOfInterest,
} from "./selectFieldOptions";
import style from "./form.module.scss";

const PardotFormField = ({
  field,
  isDealRegistrationField,
  formType,
  fieldRef,
  validate,
  updateTouched,
  gaDataAdded,
  updateGaDataAdded,
  updateStateFieldVisible,
  updatePartnerStateFieldVisible,
  handleCountryChange,
  usPhoneFormat,
  partnerFieldProperties,
  contactTypeValue,
  // These four props whose name start with "is" could be combined into one prop similarly to partnerFieldProperties
  // Their names also make it sound like they are boolean values (they are actually strings used as hidden field values)
  isContactType,
  isRecordTypeId,
  isAssetTitle,
  isAssetType,
  isAssetUrl,
  isContactField,
}) => {
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
  // This function could be renamed and/or split into smaller parts
  // Currently it not only checks whether the field is a select field, but also adds the options to the field
  function isSelectField(field) {
    const selectFields = [
      { regex: /(^country|^company hq country)/, options: countries },
      { regex: /(^state|^company hq state)/, options: states },
      { regex: /employees/, options: employees },
      { regex: /current crm solution/, options: crmSolutions },
      { regex: /preferred master agent/, options: preferredMasterAgent },
      { regex: /partner area of interest/, options: partnerAreaOfInterest },
    ];
    for (let i = 0; i < selectFields.length; i++) {
      if (selectFields[i].regex.test(String(field.name).toLocaleLowerCase())) {
        field.options = selectFields[i].options;
        return true;
      }
    }
    return false;
  }

  // Partner company country and partner company state field need to be select type for other forms except for deal registration form
  // This function could be renamed and/or split into smaller parts
  // Currently it not only checks whether the field is a select field, but also adds the options to the field
  function isAdditionalSelectField(field) {
    const selectFields = [
      {
        regex: /(^partner company country|^partner country)/,
        options: countries,
      },
      { regex: /^partner company state/, options: states },
    ];
    for (let i = 0; i < selectFields.length; i++) {
      if (
        selectFields[i].regex.test(String(field.name).toLocaleLowerCase()) &&
        !isDealRegistrationField
      ) {
        field.options = selectFields[i].options;
        return true;
      }
    }
    return false;
  }

  function phoneNumberFormatter() {
    if (field.name.toLowerCase().includes("phone")) {
      fieldRef.current.value = formatPhoneNumber(fieldRef.current.value);
    }
  }

  const pasteBlocker = (e) => {
    if (isContactField) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  };

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
            updateTouched();
            validate();
          }}
          onPaste={pasteBlocker}
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
            updateTouched();
            if (usPhoneFormat) {
              phoneNumberFormatter();
            } else validate();
          }}
          onPaste={pasteBlocker}
          onKeyDown={() => {
            if (usPhoneFormat) {
              phoneNumberFormatter();
            }
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
            updateTouched();
            validate();
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
                updateTouched();
                validate();
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
                updateTouched();
                validate();
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
              onBlur={(e) => {
                if (field.name.toLowerCase().match(/country/)) {
                  const isPartnerCountry = field.name
                    .toLowerCase()
                    .match(/partner/);
                  handleCountryChange(e.target.value, isPartnerCountry);
                  if (isPartnerCountry) {
                    updatePartnerStateFieldVisible(
                      e.target.value == "United States"
                    );
                  } else {
                    updateStateFieldVisible(e.target.value == "United States");
                  }
                }
                validate();
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
            this.updateTouched(index);
            validate();
          }}
          onPaste={pasteBlocker}
          ref={fieldRef}
        />
      );
  }
};

export default PardotFormField;
