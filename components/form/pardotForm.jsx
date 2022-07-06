import React, { Component } from "react";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import { countries, states } from "./selectFieldOptions";
import style from "./form.module.scss";
import FormError from "./formError";
import { isEmail, isPhoneNumber } from "../../shop/utils/validation";

class PardotForm extends Component {
  constructor(props) {
    super(props);
    this.phoneNumberFormatter = this.phoneNumberFormatter.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTouched = this.updateTouched.bind(this);
    this.phoneFieldRef = React.createRef();
    this.fieldRefs = Array(this.props.fieldData.length)
      .fill(0)
      .map(() => {
        return React.createRef();
      });
    this.errorMessages = [
      { field: "Email", message: "Please enter a valid email" },
      {
        field: "Phone Number",
        message: "Please enter a valid phone number",
      },
    ];
    this.state = {
      errors: Array(this.props.fieldData.length).fill(false),
      touched: Array(this.props.fieldData.length).fill(false),
    };
  }

  phoneNumberFormatter() {
    const phoneField = this.form["Phone Number"];
    if (phoneField) {
      phoneField.value = formatPhoneNumber(phoneField.value);
    }
  }

  updateTouched(index) {
    const touched = this.state.touched;
    touched[index] = true;
    this.setState({ touched: touched });
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

  handleSubmit(e) {
    if (
      !this.onSubmitValidate() ||
      this.form.honeyname.value ||
      this.form.honeyemail.value
    ) {
      e.preventDefault();
    }
  }

  generateInputElement(field, index) {
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
            onBlur={() => {
              this.validate();
            }}
            onChange={() => this.updateTouched(index)}
            ref={this.fieldRefs[index]}
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
            onBlur={() => {
              this.phoneNumberFormatter();
              this.validate();
            }}
            onChange={() => this.updateTouched(index)}
            onKeyDown={this.phoneNumberFormatter}
            // ref={this.phoneFieldRef.current ? null : this.phoneFieldRef}
            ref={this.fieldRefs[index]}
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
            onBlur={() => {
              this.validate();
            }}
            onChange={() => this.updateTouched(index)}
            ref={this.fieldRefs[index]}
          />
        );
      case "text":
        return (
          <input
            name={field.name}
            id={field.id}
            maxLength="50"
            hidden={this.isHiddenField(field)}
            onBlur={() => {
              this.validate();
            }}
            onChange={() => this.updateTouched(index)}
            ref={this.fieldRefs[index]}
          />
        );
      case "select":
        return (
          <>
            {field.options.length > 0 ? (
              <select ref={this.fieldRefs[index]} name={field.name}>
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
              this.validate();
            }}
            onChange={() => this.updateTouched(index)}
            ref={this.fieldRefs[index]}
          />
        );
    }
  }

  getErrorMessage(fieldName) {
    let errorMessage = "Please enter a valid value";
    this.errorMessages.forEach((item) => {
      if (item.field == fieldName) {
        errorMessage = item.message;
      }
    });
    return errorMessage;
  }

  validate(submitflag = false) {
    let touched = submitflag
      ? Array(this.fieldRefs.length).fill(true)
      : this.state.touched;
    const errors = Array(this.fieldRefs.length).fill(false);
    this.fieldRefs.forEach((fieldRef, index) => {
      if (touched[index] == true) {
        if (this.props.fieldData[index].isRequired && !fieldRef.current.value) {
          errors[index] = true;
        } else if (fieldRef.current.value) {
          switch (fieldRef.current.name) {
            case "Phone Number":
              if (!isPhoneNumber(formatPhoneNumber(fieldRef.current.value))) {
                errors[index] = true;
              }
              break;
            case "Email":
              if (!isEmail(fieldRef.current.value)) {
                errors[index] = true;
              }
              break;
            default:
              if (
                !Boolean(fieldRef.current.value) &&
                this.props.fieldData[index].isRequired
              ) {
                errors[index] = true;
              }
          }
        }
      }
    });
    this.setState({ errors: errors, validity: !errors.includes(true) });
    return !errors.includes(true);
  }

  onSubmitValidate() {
    this.setState({ touched: Array(this.fieldRefs.length).fill(true) });
    const flag = this.validate(true);
    return flag;
  }

  render() {
    return (
      <form
        action="https://info.ujet.cx/l/986641/2022-06-29/k12n5"
        method="post"
        onSubmit={(e) => {
          this.handleSubmit(e);
        }}
        ref={(form) => (this.form = form)}
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
              {this.generateInputElement(field, index)}
              {this.state.errors[index] && (
                <FormError
                  message={this.getErrorMessage(
                    this.props.fieldData[index].name
                  )}
                />
              )}
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
