import { Component } from "react";
import style from "./jobApplicationForm.module.scss";
import { renderHTML } from "@agility/nextjs";
import FormErrors from "./error";
import { isEmail, isPhoneNumber } from "../../shop/utils/validation";
import { formatPhoneNumber } from "../../shop/utils/formatData";

class JobApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.phoneNumberFormatter = this.phoneNumberFormatter.bind(this);
    this.fields = this.props.config.fields;
    this.state = {
      errors: {
        email: false,
        phone: false,
        firstName: false,
        lastName: false,
        resume: false,
        coverLetter: false,
      },
      touched: {
        email: false,
        phone: false,
        firstName: false,
        lastName: false,
        resume: false,
        coverLetter: false,
      },
      validity: true,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // Validating
    if (
      this.onSubmitValidate() &&
      !this.form.honeyname.value &&
      !this.form.honeyemail.value
    ) {
      // const formData = new FormData(this.form);
      // formData.delete("honeyname");
      // formData.delete("honeyemail");
    }
  }

  onSubmitValidate() {
    const touched = {
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      resume: true,
      coverLetter: true,
    };
    this.setState({ touched: touched });
    const flag = this.validate(true);
    return flag;
  }

  phoneNumberFormatter() {
    const inputField = this.form.phone;
    inputField.value = formatPhoneNumber(inputField.value);
  }

  validateFileType(field) {
    const ext = field.value.match(/\.([^\.]+)$/)[1];
    return ext == "pdf" || ext == "doc" || ext == "docx";
  }

  validate(submitflag = false) {
    let firstInvalidField;
    let flag = true;
    let errors = {
      email: false,
      phone: false,
      firstName: false,
      lastName: false,
      resume: false,
      coverLetter: false,
    };
    let touched = this.state.touched;
    if (submitflag) {
      touched = {
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        resume: true,
        coverLetter: true,
      };
    }

    if (touched.firstName && !Boolean(this.form.firstName?.value)) {
      errors.firstName = true;
      flag = false;
      if (!firstInvalidField) {
        firstInvalidField = this.form.firstName;
      }
    }

    if (touched.lastName && !Boolean(this.form.lastName.value)) {
      errors.lastName = true;
      flag = false;
      if (!firstInvalidField) {
        firstInvalidField = this.form.lastName;
      }
    }

    // Validating email
    if (touched.email && !isEmail(this.form.email?.value)) {
      errors.email = true;
      flag = false;
      if (!firstInvalidField) {
        firstInvalidField = this.form.email;
      }
    } else {
      errors.email = false;
    }

    // Validating Phone
    if (
      touched.phone &&
      !isPhoneNumber(formatPhoneNumber(this.form.phone.value))
    ) {
      errors.phone = true;
      flag = false;
      if (!firstInvalidField) {
        firstInvalidField = this.form.phone;
      }
    } else {
      errors.phone = false;
    }

    if (touched.resume) {
      if (!Boolean(this.form.resume?.value)) {
        errors.resume = true;
        flag = false;
        if (!firstInvalidField) {
          firstInvalidField = this.form.resume;
        }
      } else {
        if (this.validateFileType(this.form.resume)) {
          errors.resume = false;
        } else {
          errors.resume = true;
          flag = false;
          this.form.resume.value = "";
        }
      }
    }

    if (touched.coverLetter) {
      if (!Boolean(this.form.coverLetter.value)) {
        errors.coverLetter = false;
      } else {
        if (this.validateFileType(this.form.coverLetter)) {
          errors.coverLetter = false;
        } else {
          errors.coverLetter = true;
          flag = false;
          this.form.coverLetter.value = "";
        }
      }
    }
    if (submitflag && firstInvalidField) {
      window.scroll(
        0,
        window.scrollY + firstInvalidField.getBoundingClientRect().top - 150
      );
    }
    this.setState({ errors: errors }, () => {
      let validity = true;
      const errorKeys = Object.keys(this.state.errors);
      for (let i = 0; i < errorKeys.length; i++) {
        if (this.state.errors[errorKeys[i]] == true) {
          validity = false;
          break;
        }
      }
      this.setState({ validity: validity });
    });
    return flag;
  }

  render() {
    return (
      <div className="grid">
        <div className={style.formContainer}>
          <h2 className="heading-5 align-center mb-3">Apply for this job</h2>
          <form
            className={style.applicationForm}
            ref={(form) => (this.form = form)}
            onSubmit={this.handleSubmit}
          >
            <input
              type="hidden"
              name="positionName"
              id="positionName"
              value={this.props.positionName}
            />
            <fieldset className="row">
              <div
                className={`col col-2 ${
                  this.state.errors.firstName
                    ? style.error
                    : this.state.touched.firstName
                    ? style.valid
                    : null
                }`}
              >
                <label htmlFor="firstName">
                  <span className={style.required}>*</span>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="firstName"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.firstName = true;
                    this.setState({ touched: touch });
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.firstName && (
                  <FormErrors message="Please enter your first name" />
                )}
              </div>

              <div
                className={`col col-2 ${
                  this.state.errors.lastName
                    ? style.error
                    : this.state.touched.lastName
                    ? style.valid
                    : null
                }`}
              >
                <label htmlFor="lastName">
                  <span className={style.required}>*</span>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  autoComplete="lastName"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.lastName = true;
                    this.setState({ touched: touch });
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.lastName && (
                  <FormErrors message="Please enter your last name" />
                )}
              </div>
            </fieldset>
            <fieldset className="row">
              <div
                className={`col col-2 ${
                  this.state.errors.email
                    ? style.error
                    : this.state.touched.email
                    ? style.valid
                    : null
                }`}
              >
                <label htmlFor="email">
                  <span className={style.required}>*</span>
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  autoComplete="email"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.email = true;
                    this.setState({ touched: touch });
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.email && (
                  <FormErrors message="Please enter a valid email" />
                )}
              </div>
              <div
                className={`col col-2 ${
                  this.state.errors.phone
                    ? style.error
                    : this.state.touched.phone
                    ? style.valid
                    : null
                }`}
              >
                <label htmlFor="phone">
                  <span className={style.required}>*</span>
                  Phone Number
                </label>
                <input
                  name="phone"
                  id="phone"
                  title="Phone Number"
                  onBlur={() => {
                    this.phoneNumberFormatter();
                    this.validate();
                  }}
                  onKeyDown={this.phoneNumberFormatter}
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.phone = true;
                    this.setState({ touched: touch });
                  }}
                />
                {this.state.errors.phone && (
                  <FormErrors message="Please enter a valid phone number" />
                )}
              </div>
            </fieldset>
            <fieldset className="row mb-3">
              <div
                className={`col col-2 ${
                  this.state.errors.resume ? style.error : null
                }`}
              >
                <label htmlFor="resume">
                  <span className={style.required}>*</span>
                  Resume/CV
                </label>
                <input
                  name="resume"
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.resume = true;
                    this.setState({ touched: touch });
                    this.validate();
                  }}
                />
                {this.state.errors.resume && (
                  <FormErrors message="Please upload a resume/CV in one of the following file formats: .pdf, .doc, .docx" />
                )}
              </div>
              <div
                className={`col col-2 ${
                  this.state.errors.coverLetter ? style.error : null
                }`}
              >
                <label htmlFor="coverLetter">Cover Letter</label>
                <input
                  name="coverLetter"
                  id="coverLetter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.coverLetter = true;
                    this.setState({ touched: touch });
                    this.validate();
                  }}
                />
                {this.state.errors.coverLetter && (
                  <FormErrors message="Only the following file formats are allowed: .pdf, .doc, .docx" />
                )}
              </div>
            </fieldset>
            <div
              dangerouslySetInnerHTML={renderHTML(
                this.fields.generalSelfIdentificationText
              )}
            />
            <fieldset>
              <div className="col">
                <label htmlFor="gender">Gender</label>
                <select id="gender">
                  <option value="">Please select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Decline To Self Identify">
                    Decline To Self Identify
                  </option>
                </select>
              </div>
              <div className="col">
                <label htmlFor="gender">Are you Hispanic/Latino?</label>
                <select id="gender">
                  <option value="">Please select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Decline To Self Identify">
                    Decline To Self Identify
                  </option>
                </select>
              </div>
            </fieldset>
            <div
              dangerouslySetInnerHTML={renderHTML(
                this.fields.veteranSelfIdentificationText
              )}
            />
            <fieldset>
              <div className="col">
                <label htmlFor="veteranStatus">Veteran Status</label>
                <select id="veteranStatus">
                  <option value="">Please select</option>
                  <option value="No">I am not a protected veteran</option>
                  <option value="Yes">
                    I identify as one or more of the classifications of a
                    protected veteran
                  </option>
                  <option value="No answer">I don't wish to answer</option>
                </select>
              </div>
            </fieldset>

            <div
              dangerouslySetInnerHTML={renderHTML(
                this.fields.disabilitySelfIdentificationText
              )}
            />
            <fieldset>
              <div className="col">
                <label htmlFor="disabilityStatus">Disability Status</label>
                <select id="disabilityStatus">
                  <option value="">Please select</option>
                  <option value="Yes">
                    Yes, I have a disability, or have a history/record of having
                    a disability
                  </option>
                  <option value="No">
                    No, I don't have a disability, or a history/record of having
                    a disability
                  </option>
                  <option value="No answer">I don't wish to answer</option>
                </select>
              </div>
            </fieldset>
            <div
              dangerouslySetInnerHTML={renderHTML(this.fields.footnoteText)}
            />
            {/* START: Honeypot */}
            <label className={style.removehoney} htmlFor="honeyname"></label>
            <input
              className={style.removehoney}
              autoComplete="off"
              type="text"
              id="honeyname"
              name="honeyname"
            />
            <label className={style.removehoney} htmlFor="honeyemail"></label>
            <input
              className={style.removehoney}
              autoComplete="off"
              type="email"
              id="honeyemail"
              name="honeyemail"
            />
            {/* END: Honeypot */}
            <div className="d-flex flex-direction-column align-items-center">
              <button className="button margin-center-horizontal" type="submit">
                Submit Application
              </button>
              {!this.state.validity && (
                <FormErrors message="Please fill the required fields with valid values." />
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default JobApplicationForm;
