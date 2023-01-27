import React, { Component, Fragment } from "react";
import style from "./jobApplicationForm.module.scss";
import { renderHTML } from "@agility/nextjs";
import FormErrors from "./error";
import { isEmail, isPhoneNumber } from "../../shop/utils/validation";
import { formatPhoneNumber } from "../../shop/utils/formatData";
import Router from "next/router";
import { Field } from "./field";

class JobApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.linkedInProfileField = false;
    this.websiteField = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.phoneNumberFormatter = this.phoneNumberFormatter.bind(this);
    this.validate = this.validate.bind(this);
    this.updateTouched = this.updateTouched.bind(this);
    this.fieldRefs = Array(this.props.jobData.questions.length)
      .fill(0)
      .map(() => {
        return React.createRef();
      });
    // If the limit is changed here, the config in /pages/api/postJobApplication.js should be changed accordingly
    this.attachmentFilesizeLimitMegabytes = 3;
    this.errorMessages = [
      { field: "first_name", message: "Please enter your first name" },
      { field: "last_name", message: "Please enter your last name" },
      { field: "email", message: "Please enter a valid email" },
      { field: "phone", message: "Please enter a valid phone number" },
      {
        field: "resume",
        message: `Please upload a resume/CV (max file size ${this.attachmentFilesizeLimitMegabytes}MB) in one of the following file formats: .pdf, .doc, .docx`,
      },
      {
        field: "cover_letter",
        message: `Please upload a cover letter (max file size ${this.attachmentFilesizeLimitMegabytes}MB) in one of the following file formats: .pdf, .doc, .docx`,
      },
    ];
    this.state = {
      errors: Array(this.props.jobData.questions.length).fill(false),
      touched: Array(this.props.jobData.questions.length).fill(false),
      raceSelectEnabled: false,
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
      const applicationData = {};
      for (let i = 0; i < this.props.jobData.questions.length; i++) {
        const question = this.props.jobData.questions[i];
        const fieldName = question.fields[0].name;
        if (fieldName == "resume") {
          await this.readFileAsBase64String(this.form[fieldName].files[0]).then(
            (result) => {
              applicationData.resume_content = result;
              applicationData.resume_content_filename =
                this.form[fieldName].files[0].name;
            }
          );
        } else if (fieldName == "cover_letter") {
          if (this.form[fieldName].files.length > 0) {
            await this.readFileAsBase64String(
              this.form[fieldName].files[0]
            ).then((result) => {
              applicationData.cover_letter_content = result;
              applicationData.cover_letter_content_filename =
                this.form[fieldName].files[0].name;
            });
          }
        } else {
          applicationData[fieldName] = /^-?\d+$/.test(
            this.form[fieldName].value
          )
            ? parseInt(this.form[fieldName].value)
            : this.form[fieldName].value;
        }
      }
      this.props.jobData?.compliance?.forEach?.((item) => {
        item.questions.forEach((question) => {
          const questionField = this.form[question.fields[0].name];
          applicationData[questionField.name] = /^-?\d+$/.test(
            questionField.value
          )
            ? parseInt(questionField.value)
            : questionField.value;
        });
      });
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
            id: this.props.jobData.id,
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
    this.setState({ touched: Array(this.fieldRefs.length).fill(true) });
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

  validateFileSize(file) {
    return file.size <= this.attachmentFilesizeLimitMegabytes * 1000000;
  }

  updateTouched(index) {
    const touched = this.state.touched;
    touched[index] = true;
    this.setState({ touched: touched });
  }

  getErrorMessage(fieldName) {
    let errorMessage = "Please fill this field";
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
        switch (fieldRef.current.id) {
          case "phone":
            if (!isPhoneNumber(formatPhoneNumber(fieldRef.current.value))) {
              errors[index] = true;
            }
            break;
          case "email":
            if (!isEmail(fieldRef.current.value)) {
              errors[index] = true;
            }
            break;
          case "resume":
            if (
              !Boolean(fieldRef.current.value) ||
              !this.validateFileType(fieldRef.current) ||
              !this.validateFileSize(fieldRef.current.files[0])
            ) {
              errors[index] = true;
              fieldRef.current.value = "";
            }
            break;
          case "cover_letter":
            if (
              Boolean(fieldRef.current.value) &&
              (!this.validateFileType(fieldRef.current) ||
                !this.validateFileSize(fieldRef.current.files[0]))
            ) {
              errors[index] = true;
              fieldRef.current.value = "";
            }
            break;
          default:
            if (
              !Boolean(fieldRef.current.value) &&
              this.props.jobData.questions[index].required
            ) {
              errors[index] = true;
            }
        }
      }
    });
    this.setState({ errors: errors });
    if (submitflag && errors.includes(true)) {
      const errorIndex = errors.findIndex((error) => error == true);
      window.scroll(
        0,
        window.scrollY +
          this.fieldRefs[errorIndex].current.getBoundingClientRect().top -
          150
      );
    }
    this.setState({ validity: !errors.includes(true) });
    return !errors.includes(true);
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
            <fieldset className="row mb-3">
              {this.props.jobData.questions.map((question, index) => {
                return (
                  <Field
                    key={`customQuestion${index}`}
                    data={question}
                    fieldRef={this.fieldRefs[index]}
                    error={this.state.errors[index]}
                    errorMessage={this.getErrorMessage(
                      this.props.jobData.questions[index].fields[0].name
                    )}
                    className={
                      this.state.errors[index] == true
                        ? style.error
                        : this.state.touched[index] &&
                          this.props.jobData.questions[index].required
                        ? style.valid
                        : null
                    }
                    validate={this.validate}
                    updateTouched={() => {
                      this.updateTouched(index);
                    }}
                  />
                );
              })}
            </fieldset>
            {this.props.jobData?.compliance?.map?.((item, index) => {
              return (
                <Fragment key={`compliance${index}`}>
                  <div dangerouslySetInnerHTML={renderHTML(item.description)} />
                  {item.questions.length > 0 && (
                    <fieldset>
                      {item.questions.map(
                        (question, complianceQuestionIndex) => {
                          question.label = question.label.replace(
                            /([A-Z])/g,
                            " $1"
                          );
                          return (
                            <Field
                              key={`complianceQuestion${complianceQuestionIndex}`}
                              data={question}
                            />
                          );
                        }
                      )}
                    </fieldset>
                  )}
                </Fragment>
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
