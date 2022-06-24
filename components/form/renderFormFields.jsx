import { useEffect, useRef, useState } from "react";

const getGormField = () => {
  switch (field.type) {
    case "email":
      <div>
        <label htmlFor="email">
          <span className="">*</span> {field.label}
        </label>
        <input name="email" id="email" autoComplete="email" maxLength="50" />
      </div>;
    case "phone":
      <div>
        <label htmlFor="phone">
          <span className="">*</span> {field.label}
        </label>
        <input name="phone" id="phone" title="Phone Number"></input>
      </div>;
    case "text":
      <div>
        <label htmlFor={field.id}>
          <span className="">*</span> {field.label}
        </label>
        <input
          type="text"
          name={field.name}
          id={field.id}
          autoComplete={field.id}
          maxLength="50"
        />
      </div>;
    case "select":
      <div>
        <label htmlFor={field.id}>
          <span className="">*</span> {field.label}
        </label>
        <select
          name={field.name}
          id={field.id}
          title="State"
          aria-labelledby="LblState InstructState"
          aria-invalid="true"
        >
          {field.options?.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>;
    default:
      break;
  }
};

const RenderFormFields = ({ fields }) => {
  fields = [];
  return fields.map((field) => getGormField(field.type));
};

export default RenderFormFields;
