import { Component } from "react";
import style from "./jobApplicationForm.module.scss";
import { renderHTML } from "@agility/nextjs";
import FormErrors from "./error";
import { isEmail, isPhoneNumber } from "../../shop/utils/validation";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import Router from "next/router";

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
      postInProgress: false,
      postError: false,
    };
  }

  async handleSubmit(e) {
    e.preventDefault();
    // Validating
    if (
      this.onSubmitValidate() &&
      !this.form.honeyname.value &&
      !this.form.honeyemail.value
    ) {
      const applicationData = {
        first_name: this.form.firstName.value,
        last_name: this.form.lastName.value,
        email: this.form.email.value,
        phone: this.form.phone.value,
        gender: this.form.gender.value,
        race: this.form.race.value,
        veteran_status: this.form.veteranStatus.value,
        disability_status: this.form.disabilityStatus.value,
      };
      await this.readFileAsBase64String(this.form.resume.files[0]).then(
        (result) => {
          applicationData.resume_content = result;
          applicationData.resume_content_filename =
            this.form.resume.files[0].name;
        }
      );
      if (this.form.coverLetter.files.length > 0) {
        await this.readFileAsBase64String(this.form.coverLetter.files[0]).then(
          (result) => {
            applicationData.cover_letter_content = result;
            applicationData.cover_letter_content_filename =
              this.form.coverLetter.files[0].name;
          }
        );
      }
      this.sendApplicationData(applicationData);
    }
  }

  async readFileAsBase64String(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onloadend = () => {
        resolve(window.btoa(reader.result));
      };
    });
  }

  async sendApplicationData(applicationData) {
    if (!this.state.postInProgress) {
      this.setState({ postInProgress: true, postError: false });
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/postJobApplication`,
        {
          method: "POST",
          body: JSON.stringify({
            applicationData: applicationData,
            id: this.props.jobId,
          }),
        }
      );
      const response = await request.json();
      if (!response.postSuccess) {
        this.setState({ postError: true });
        this.setState({ postInProgress: false });
      } else {
        Router.push("/thank-you-application");
      }
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
                <div className={style.selectWrapper}>
                  <select name="gender" id="gender">
                    <optgroup label="Gender">
                      <option value="">Please select</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Decline To Self Identify</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="col">
                <label htmlFor="race">Are you Hispanic/Latino?</label>
                <div className={style.selectWrapper}>
                  <select name="race" id="race">
                    <optgroup label="Are you Hispanic/Latino?">
                      <option value="">Please select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Decline To Self Identify">
                        Decline To Self Identify
                      </option>
                    </optgroup>
                  </select>
                </div>
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
                <div className={style.selectWrapper}>
                  <select name="veteranStatus" id="veteranStatus">
                    <optgroup label="Veteran Status">
                      <option value="">Please select</option>
                      <option value="1">I am not a protected veteran</option>
                      <option value="2">
                        I identify as one or more of the classifications of a
                        protected veteran
                      </option>
                      <option value="3">I don't wish to answer</option>
                    </optgroup>
                  </select>
                </div>
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
                <div className={style.selectWrapper}>
                  <select name="disabilityStatus" id="disabilityStatus">
                    <optgroup label="Disability Status">
                      <option value="">Please select</option>
                      <option value="1">
                        Yes, I have a disability, or have a history/record of
                        having a disability
                      </option>
                      <option value="2">
                        No, I don't have a disability, or a history/record of
                        having a disability
                      </option>
                      <option value="3">I don't wish to answer</option>
                    </optgroup>
                  </select>
                </div>
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
                {this.state.postInProgress
                  ? "Please wait..."
                  : "Submit Application"}
              </button>
              {!this.state.validity && (
                <FormErrors message="Please fill the required fields with valid values." />
              )}
              {this.state.postError && (
                <FormErrors message="Something went wrong. Please try again later." />
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default JobApplicationForm;
