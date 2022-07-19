import { formatPhoneNumber } from "../../shop/utils/formatData";
import { addGaData } from "../../utils/pardotForm";
import { countries, states } from "./selectFieldOptions";
import style from "./form.module.scss";

const PardotFormField = ({
  field,
  isHiddenField,
  fieldRef,
  validate,
  updateTouched,
  gaDataAdded,
  updateGaDataAdded,
  updateStateFieldVisible,
}) => {
  if (isSelectField(field)) {
    field.dataFormat = "select";
  } else if (field.name.toLowerCase().includes("phone")) {
    field.dataFormat = "phone";
  }
  function isSelectField(field) {
    const selectFields = [
      { regex: /country/, options: countries },
      { regex: /state/, options: states },
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
              // At the time of writing multiple email fields exist for some reason
              fieldRef.current
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
          onBlur={() => {
            phoneNumberFormatter();
            validate();
          }}
          onChange={updateTouched}
          onKeyDown={phoneNumberFormatter}
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
                if (field.name.toLowerCase() == "country") {
                  updateStateFieldVisible(e.target.value == "United States");
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
