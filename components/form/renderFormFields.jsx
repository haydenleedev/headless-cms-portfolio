// import { useEffect, useRef, useState } from "react";

const getGormField = (field) => {
  console.log("Getting form field for: ", field.dataFormat);
  switch (field.dataFormat) {
    case "email":
      return (
        <div>
          <label htmlFor={field.id}>
            <span className="">*</span> {field.name}
          </label>
          <input
            name={field.name}
            id={field.id}
            autoComplete="email"
            maxLength="50"
            required={field.isRequired}
          />
        </div>
      );
    case "phone":
      return (
        <div>
          <label htmlFor={field.id}>
            <span className="">*</span> {field.name}
          </label>
          <input name="phone" id="phone" title="Phone Number"></input>
        </div>
      );
    case "text":
      return (
        <div>
          <label htmlFor={field.id}>
            <span className="">*</span> {field.name}
          </label>
          <input
            name={field.name}
            id={field.id}
            maxLength="50"
            required={field.isRequired}
          />
        </div>
      );
    // case "select":
    //   <div>
    //     <label htmlFor={field.id}>
    //       <span className="">*</span> {field.name}
    //     </label>
    //     <select
    //       name={field.name}
    //       id={field.id}
    //       title="State"
    //       aria-labelledby="LblState InstructState"
    //       aria-invalid="true"
    //     >
    //       {field.options?.map((option) => (
    //         <option value={option.value}>{option.label}</option>
    //       ))}
    //     </select>
    //   </div>;
    default:
      return (
        <div>
          <label htmlFor={field.id}>
            <span className="">*</span> {field.name}
          </label>
          <input
            name={field.name}
            id={field.id}
            maxLength="50"
            required={field.isRequired}
          />
        </div>
      );
  }
};

const RenderFormFields = ({ fields }) => {
  return fields.map((field) => getGormField(field));
};

export default RenderFormFields;
