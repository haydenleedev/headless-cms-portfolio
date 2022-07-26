import { formatPhoneNumber } from "../../shop/utils/formatData";
import { addGaData } from "../../utils/pardotForm";
import {
  countries,
  crmSolutions,
  employees,
  states,
} from "./selectFieldOptions";
import style from "./form.module.scss";

const PardotFormField = ({
  field,
  isHiddenField,
  isDealRegistrationField,
  fieldRef,
  validate,
  updateTouched,
  gaDataAdded,
  updateGaDataAdded,
  updateStateFieldVisible,
  updateSelectedCountry,
  usPhoneFormat,
}) => {
  if (isSelectField(field)) {
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
      { regex: /country/, options: countries },
      { regex: /state/, options: states },
      { regex: /employees/, options: employees },
      { regex: /current crm solution/, options: crmSolutions },
    ];
    for (let i = 0; i < selectFields.length; i++) {
      if (selectFields[i].regex.test(String(field.name).toLocaleLowerCase())) {
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
          hidden={isHiddenField}
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
              isDealRegistrationField
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
          hidden={isHiddenField}
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
          title={field.name}
          hidden={isHiddenField}
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
          {field.name.toLowerCase() === "additional details" ? (
            <textarea
              name={field.name}
              id={field.id}
              maxLength="32768"
              rows="3"
              hidden={isHiddenField}
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
              hidden={isHiddenField}
              onBlur={() => {
                validate();
              }}
              onChange={updateTouched}
              ref={fieldRef}
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
              }
              }`}
              onChange={(e) => {
                if (field.name.toLowerCase().match(/country/)) {
                  updateStateFieldVisible(e.target.value == "United States");
                  updateSelectedCountry(e.target.value);
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
