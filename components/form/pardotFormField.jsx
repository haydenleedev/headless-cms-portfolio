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
  updateSelectedCountry,
  usPhoneFormat,
  partnerFieldProperties,
  isContactType,
  contactTypeValue,
  isRecordTypeId,
  isAssetTitle,
  isAssetType,
  isAssetUrl,
}) => {
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
  switch (field.dataFormat) {
    case "email":
      return (
        <input
          hidden={isHiddenField(field, isDealRegistrationField)}
          name={field.name}
          id={field.id}
          autoComplete="email"
          maxLength="50"
          onBlur={() => {
            validate();
          }}
          onChange={updateTouched}
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
          maxLength={usPhoneFormat ? null : 15}
          onBlur={() => {
            if (usPhoneFormat) {
              phoneNumberFormatter();
            }
            validate();
          }}
          onChange={() => {
            updateTouched();
            if (!usPhoneFormat) {
              validate();
            }
          }}
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
            validate();
          }}
          onChange={updateTouched}
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
              maxLength="32768"
              rows="3"
              hidden={isHiddenField(field, isDealRegistrationField)}
              onBlur={() => {
                validate();
              }}
              onChange={updateTouched}
              ref={fieldRef}
            ></textarea>
          ) : (
            <input
              name={field.name}
              id={field.id}
              maxLength="50"
              hidden={isHiddenField(field, isDealRegistrationField)}
              onBlur={() => {
                validate();
              }}
              onChange={updateTouched}
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
              onChange={(e) => {
                if (field.name.toLowerCase().match(/country/)) {
                  const isPartnerCountry = field.name
                    .toLowerCase()
                    .match(/partner/);
                  updateSelectedCountry(e.target.value, isPartnerCountry);
                  if (isPartnerCountry) {
                    updatePartnerStateFieldVisible(
                      e.target.value == "United States"
                    );
                  } else {
                    updateStateFieldVisible(e.target.value == "United States");
                  }
                }
              }}
              onBlur={() => {
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
          maxLength="50"
          onBlur={() => {
            validate();
          }}
          onChange={() => this.updateTouched(index)}
          ref={fieldRef}
        />
      );
  }
};

export default PardotFormField;
