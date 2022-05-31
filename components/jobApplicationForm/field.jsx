import { formatPhoneNumber } from "../../shop/utils/formatData";
import style from "./jobApplicationForm.module.scss";
import FormErrors from "./error";

export const Field = ({
  data,
  fieldRef,
  error,
  errorMessage,
  className,
  validate,
  updateTouched,
}) => {
  const phoneNumberFormatter = () => {
    fieldRef.current.value = formatPhoneNumber(fieldRef.current.value);
  };
  const isPhoneField = data.fields[0].name == "phone";
  return (
    <div
      className={`col ${
        [
          "first_name",
          "last_name",
          "email",
          "phone",
          "resume",
          "cover_letter",
        ].includes(data.fields[0].name)
          ? "col-2"
          : ""
      } ${className}`}
    >
      <label htmlFor={data.fields[0].name}>
        {data.required && <span className={style.required}>*</span>}
        {data.label}
      </label>
      {data.fields[0].type == "input_file" && (
        <input
          name={data.fields[0].name}
          id={data.fields[0].name}
          ref={fieldRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={() => {
            updateTouched();
            validate();
          }}
        />
      )}
      {data.fields[0].type == "input_text" && (
        <input
          type="text"
          maxLength={isPhoneField ? "" : "50"}
          autoComplete={data.fields[0].name}
          name={data.fields[0].name}
          id={data.fields[0].name}
          ref={fieldRef}
          onChange={() => {
            updateTouched();
          }}
          onBlur={() => {
            if (isPhoneField) {
              phoneNumberFormatter();
            }
            validate();
          }}
          onKeyDown={() => {
            if (isPhoneField) {
              phoneNumberFormatter();
            }
          }}
        />
      )}
      {(data.fields[0].type == "multi_value_multi_select" ||
        data.fields[0].type == "multi_value_single_select") && (
        <div className={style.selectWrapper}>
          <select
            name={data.fields[0].name}
            id={data.fields[0].name}
            ref={fieldRef}
          >
            <optgroup label={data.label}>
              <option value="">Please select</option>
              {data.fields[0].values.map((option, optionIndex) => {
                return (
                  <option
                    key={`${data.fields[0].name}Option${optionIndex}`}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
      )}
      {error && <FormErrors message={errorMessage} />}
    </div>
  );
};
