import { useEffect, useRef, useState } from "react";
import style from "./renderFormFields.module.scss";

const RenderFormFields = ({ fields }) => {
  const [errors, setErrors] = useState([]);

  const isHiddenField = (field) => {
    // Blacklist hidden fields from Pardot form handler fields
    const hiddenFields = [/ga_/, /utm_/, /current lead/, /hidden/, /hide/];

    // Check whether form field is blacklisted
    if (
      hiddenFields.some((re) => re.test(String(field.name).toLocaleLowerCase()))
    )
      return true;
    return false;
  };

  const FormFieldWrapper = ({ field, children }) => (
    <div
      className={isHiddenField(field) ? style.formFieldHidden : style.formField}
    >
      <FormFieldLabel field={field}></FormFieldLabel>
      {children}
      <FormFieldError field={field}></FormFieldError>
    </div>
  );

  const FormFieldLabel = ({ field }) => (
    <label htmlFor={field.id}>
      <span className="">*</span> {field.name}
    </label>
  );

  // TODO: create error handling by pushing error field id to array.
  const FormFieldError = ({ field }) => {
    if (errors.includes(fields.id)) {
      return <span className={style.error}>{field.errorMessage}</span>;
    } else {
      return null;
    }
  };

  const getFormField = (field) => {
    console.log("Getting form field for: ", field.dataFormat);
    switch (field.dataFormat) {
      case "email":
        return (
          <FormFieldWrapper field={field}>
            <input
              hidden={isHiddenField(field)}
              name={field.name}
              id={field.id}
              autoComplete="email"
              maxLength="50"
              required={field.isRequired}
            />
          </FormFieldWrapper>
        );
      // TODO: Phoen is also returned as number type, so have to detect if field.name contains "Phone",
      // And render phone type and not number....
      case "phone":
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              type="phone"
              title={field.name}
              hidden={isHiddenField(field)}
            ></input>
          </FormFieldWrapper>
        );
      case "number":
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              type="number"
              title={field.name}
              hidden={isHiddenField(field)}
            ></input>
          </FormFieldWrapper>
        );
      case "text":
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              maxLength="50"
              hidden={isHiddenField(field)}
              required={field.isRequired}
            />
          </FormFieldWrapper>
        );
      // TODO: create select field logic since pardot only return "Text" fields
      // So we have to detect fake select fields and render them accordingly
      // Ask Max for more
      // case "select":
      default:
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              maxLength="50"
              required={field.isRequired}
            />
          </FormFieldWrapper>
        );
    }
  };

  return fields.map((field) => getFormField(field));
};

export default RenderFormFields;
