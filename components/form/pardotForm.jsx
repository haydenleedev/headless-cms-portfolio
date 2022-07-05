import React, { Component } from "react";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import { countries, states } from "./selectFieldOptions";
import style from "./form.module.scss";

class PardotForm extends Component {
  constructor(props) {
    super(props);
    this.phoneNumberFormatter = this.phoneNumberFormatter.bind(this);
    this.phoneFieldRef = React.createRef();
    this.state = {
      errors: [],
    };
  }

  phoneNumberFormatter() {
    if (this.phoneFieldRef.current) {
      this.phoneFieldRef.current.value = formatPhoneNumber(
        this.phoneFieldRef.current.value
      );
    }
  }

  isHiddenField(field) {
    // Blacklist hidden fields from Pardot form handler fields
    const hiddenFields = [/ga_/, /utm_/, /current lead/, /hidden/, /hide/];

    // Check whether form field is blacklisted
    if (
      hiddenFields.some((re) => re.test(String(field.name).toLocaleLowerCase()))
    ) {
      return true;
    }

    return false;
  }

  isSelectField(field) {
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

  generateInputElement(field) {
    if (this.isSelectField(field)) {
      field.dataFormat = "select";
    } else if (field.name.toLowerCase().includes("phone")) {
      field.dataFormat = "phone";
    }
    switch (field.dataFormat) {
      case "email":
        return (
          <input
            hidden={this.isHiddenField(field)}
            name={field.name}
            id={field.id}
            autoComplete="email"
            maxLength="50"
            required={field.isRequired}
          />
        );
      case "phone":
        return (
          <input
            name={field.name}
            id={field.id}
            type="text"
            title={field.name}
            hidden={this.isHiddenField(field)}
            onBlur={this.phoneNumberFormatter}
            onKeyDown={this.phoneNumberFormatter}
            ref={this.phoneFieldRef.current ? null : this.phoneFieldRef}
          />
        );
      case "number":
        return (
          <input
            name={field.name}
            id={field.id}
            type="number"
            title={field.name}
            hidden={this.isHiddenField(field)}
          ></input>
        );
      case "text":
        return (
          <input
            name={field.name}
            id={field.id}
            maxLength="50"
            hidden={this.isHiddenField(field)}
            required={field.isRequired}
          />
        );
      case "select":
        return (
          <>
            {field.options.length > 0 ? (
              <select>
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
            required={field.isRequired}
          />
        );
    }
  }

  render() {
    return (
      <form
        action="https://info.ujet.cx/l/986641/2022-06-29/k12n5"
        method="post"
      >
        {this.props.fieldData.map((field, index) => {
          return (
            <div
              key={`formField${index}`}
              className={this.isHiddenField(field) ? "display-none" : ""}
            >
              <label htmlFor={field.id}>
                {field.isRequired && <span className="">*</span>} {field.name}
              </label>
              {this.generateInputElement(field)}
              {/* <FormFieldError field={field}></FormFieldError> */}
            </div>
          );
        })}
        {/* START: Honeypot */}
        <label className={style.removehoney} htmlFor="honeyname"></label>
        <input
          className={style.removehoney}
          autoComplete="off"
          type="text"
          id="honeyname"
          name="honeyname"
          tabIndex="-1"
          aria-hidden="true"
        />
        <label className={style.removehoney} htmlFor="honeyemail"></label>
        <input
          className={style.removehoney}
          autoComplete="off"
          type="email"
          id="honeyemail"
          name="honeyemail"
          tabIndex="-1"
          aria-hidden="true"
        />
        {/* END: Honeypot */}
        <input type="submit" value="submit" required="required" />
      </form>
    );
  }
}

export default PardotForm;
