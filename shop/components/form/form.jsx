import { Component } from "react";
import Button from "../buttons/button";
import FormErrors from "./errors";
import layout from "../../styles/layout.module.scss";
import form from "./form.module.scss";
import { isEmail, isPhoneNumber, isWebsite } from "../../utils/validation";
import ButtonFooter from "../buttons/button-footer";
import { formatPhoneNumber, formatWebsite } from "../../utils/formatData";
import Link from "next/link";
import GlobalContext from "../../../context";
import AgilityLink from "../../../components/agilityLink";

class ContactForm extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.phoneNumberFormatter = this.phoneNumberFormatter.bind(this);
    this.state = {
      errors: {
        email: false,
        phone: false,
        firstName: false,
        lastName: false,
        companyName: false,
        jobTitle: false,
        website: false,
        employees: false,
        street: false,
        city: false,
        state: false,
        country: false,
        zipCode: false,
        permission: false,
      },
      touched: {
        email: false,
        phone: false,
        firstName: false,
        lastName: false,
        companyName: false,
        jobTitle: false,
        website: false,
        employees: false,
        street: false,
        city: false,
        state: false,
        country: false,
        zipCode: false,
        permission: false,
      },
      scroll: false,
    };
  }

  handleSubmit() {
    const contact = {
      email: this.form.email.value,
      phone: this.form.phone.value,
      firstName: this.form.firstName.value,
      lastName: this.form.lastName.value,
      companyName: this.form.companyName.value,
      jobTitle: this.form.jobTitle.value,
      website: formatWebsite(this.form.website.value),
      employees: this.form.employees.value,
      street: this.form.billingStreet.value,
      city: this.form.billingCity.value,
      state: this.form.billingState.value,
      country: this.form.billingCountry.value,
      zipCode: this.form.billingZip.value,
      permission: this.form.permission.checked,
    };

    // Validating
    if (
      this.onSubmitValidate() &&
      this.form.permission.checked &&
      !this.form.honeyname.value &&
      !this.form.honeyemail.value
    ) {
      this.props.onContinue(contact);
      this.context.updateFormData({ contactInfo: contact });
    }
  }
  onSubmitValidate() {
    const touched = {
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      companyName: true,
      jobTitle: true,
      website: true,
      employees: true,
      street: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
      permission: true,
    };
    this.setState({ touched: touched });
    const flag = this.validate(true);
    return flag;
  }

  phoneNumberFormatter() {
    const inputField = this.form.phone;
    inputField.value = formatPhoneNumber(inputField.value);
  }

  validate(submitflag = false) {
    let flag = true;
    let errors = {
      email: false,
      phone: false,
      firstName: false,
      lastName: false,
      companyName: false,
      jobTitle: false,
      website: false,
      employees: false,
      street: false,
      city: false,
      state: false,
      country: false,
      zipCode: false,
      permission: false,
    };
    let touched = this.state.touched;
    if (submitflag) {
      touched = {
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        companyName: true,
        jobTitle: true,
        website: true,
        employees: true,
        street: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        permission: true,
      };
    }

    // Validating email
    if (touched.email && !isEmail(this.form.email?.value)) {
      errors.email = true;
      flag = false;
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
    } else {
      errors.phone = false;
    }

    // Validating website
    const website = formatWebsite(this.form.website?.value);
    if (touched.website && website && !isWebsite(website)) {
      errors.website = true;
      flag = false;
    } else if (touched.website && !website) {
      errors.website = true;
      flag = false;
    }

    if (touched.firstName && !Boolean(this.form.firstName?.value)) {
      errors.firstName = true;
      flag = false;
    }

    if (touched.lastName && !Boolean(this.form.lastName.value)) {
      errors.lastName = true;
      flag = false;
    }

    if (touched.companyName && !Boolean(this.form.companyName.value)) {
      errors.companyName = true;
      flag = false;
    }

    if (touched.employees && !Boolean(this.form.employees.value)) {
      errors.employees = true;
      flag = false;
    }

    if (touched.jobTitle && !Boolean(this.form.jobTitle.value)) {
      errors.jobTitle = true;
      flag = false;
    }

    if (touched.street && !Boolean(this.form.billingStreet.value)) {
      errors.street = true;
      flag = false;
    }

    if (touched.city && !Boolean(this.form.billingCity.value)) {
      errors.city = true;
      flag = false;
    }

    if (touched.state && !Boolean(this.form.billingState.value)) {
      errors.state = true;
      flag = false;
    }

    if (touched.country && !Boolean(this.form.billingCountry.value)) {
      errors.country = true;
      flag = false;
    }

    if (touched.zipCode && !Boolean(this.form.billingZip.value)) {
      errors.zipCode = true;
      flag = false;
    }

    if (touched.permission && !this.form.permission.checked) {
      errors.permission = true;
      flag = false;
    }

    this.setState({ errors: errors });
    return flag;
  }

  componentDidMount() {
    // document.getElementById("email").value = this.props.email
    //   ? this.props.email
    //   : "";
    document.getElementById("billingCountry").value = "United States";
    // this.setState({
    //   scroll:
    //     window.innerHeight < document.getElementById('userData').clientHeight,
    // });
  }

  render() {
    return (
      <div>
        <div className={form["form-container"]}>
          <form
            id="userData"
            action=""
            onSubmit={this.handleSubmit}
            ref={(form) => (this.form = form)}
          >
            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.email
                    ? form.error
                    : this.form?.email?.value
                    ? form.valid
                    : ""
                }`}
              >
                <label htmlFor="email">
                  <span className={form.required}>*</span> Work Email
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
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.email && (
                  <FormErrors message="Please enter a valid company email" />
                )}
              </div>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.phone
                    ? form.error
                    : this.state.touched.phone
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="phone">
                  <span className={form.required}>*</span> Phone Number
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
                    /* this.validate(); */
                  }}
                ></input>
                {this.state.errors.phone && (
                  <FormErrors message="Please enter a valid phone number" />
                )}
              </div>
            </fieldset>

            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.firstName
                    ? form.error
                    : this.state.touched.firstName
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="firstName">
                  <span className={form.required}>*</span> First Name
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
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.firstName && (
                  <FormErrors message="Please enter your first name" />
                )}
              </div>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.lastName
                    ? form.error
                    : this.state.touched.lastName
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="lastName">
                  <span className={form.required}>*</span> Last Name
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
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.lastName && (
                  <FormErrors message="Please enter your last name" />
                )}
              </div>
            </fieldset>

            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.companyName
                    ? form.error
                    : this.form?.companyName?.value
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="companyName">
                  <span className={form.required}>*</span> Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  autoComplete="companyName"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.companyName = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.companyName && (
                  <FormErrors message="Please enter your company name" />
                )}
              </div>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.jobTitle
                    ? form.error
                    : this.state.touched.jobTitle
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="jobTitle">
                  <span className={form.required}>*</span> Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  autoComplete="jobTitle"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.jobTitle = true;
                    this.setState({ touched: touch });
                    this.validate;
                  }}
                />
                {this.state.errors.jobTitle && (
                  <FormErrors message="Please enter your job title" />
                )}
              </div>
            </fieldset>

            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["w-100"]} ${
                  this.state.errors.website
                    ? form.error
                    : this.state.touched.website
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="website">
                  <span className={form.required}>*</span> Company Website
                </label>
                <input
                  type="text"
                  name="website"
                  id="website"
                  autoComplete="website"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.website = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.website && (
                  <FormErrors message="Please enter your company website url" />
                )}
              </div>
            </fieldset>

            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["w-100"]} ${
                  this.state.errors.employees
                    ? form.error
                    : this.state.touched.employees
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="employees">
                  <span className={form.required}>*</span> # of Employees
                </label>
                <input
                  type="number"
                  name="employees"
                  id="employees"
                  min="1"
                  autoComplete="employees"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.employees = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.employees && (
                  <FormErrors message="Please enter a number of employees" />
                )}
              </div>
            </fieldset>
            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.street
                    ? form.error
                    : this.state.touched.street
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="billingStreet">
                  <span className={form.required}>*</span> Billing Street
                </label>
                <input
                  type="text"
                  name="billingStreet"
                  id="billingStreet"
                  autoComplete="billingStreet"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.street = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.street && (
                  <FormErrors message="Please enter your billing street" />
                )}
              </div>
              <div
                className={`${layout.col} ${layout["col-2"]} ${
                  this.state.errors.city
                    ? form.error
                    : this.state.touched.city
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="billingCity">
                  <span className={form.required}>*</span> Billing City
                </label>
                <input
                  type="text"
                  name="billingCity"
                  id="billingCity"
                  autoComplete="billingCity"
                  maxLength="50"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.city = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.city && (
                  <FormErrors message="Please enter your billing city" />
                )}
              </div>
            </fieldset>
            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["w-100"]} ${
                  this.state.errors.state
                    ? form.error
                    : this.state.touched.state
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="billingState">
                  <span className={form.required}>*</span> Billing State
                </label>
                <select
                  name="billingState"
                  id="billingState"
                  className={form["form-select"]}
                  title="State"
                  aria-labelledby="LblState InstructState"
                  aria-invalid="true"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.state = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                >
                  <option value="">State (Company HQ)</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Alabama">Alabama</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="Arizona">Arizona</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Washington DC">Washington DC</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Maine">Maine</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Montana">Montana</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New York">New York</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Washington">Washington</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="West Virginia">West Virginia</option>
                  <option value="Wyoming">Wyoming</option>
                </select>
                {this.state.errors.state && (
                  <FormErrors message="Please select your billing state" />
                )}
              </div>
            </fieldset>
            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["w-100"]} ${
                  this.state.errors.country
                    ? form.error
                    : this.form?.country?.value
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="billingCountry">
                  <span className={form.required}>*</span> Billing Country
                </label>
                <input
                  type="text"
                  name="billingCountry"
                  id="billingCountry"
                  autoComplete="billingCountry"
                  maxLength="50"
                  disabled
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.country = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.country && (
                  <FormErrors message="Please select your billing country" />
                )}
              </div>
            </fieldset>
            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["w-100"]} ${
                  this.state.errors.zipCode
                    ? form.error
                    : this.state.touched.zipCode
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="billingZip">
                  <span className={form.required}>*</span> Zip Code
                </label>
                <input
                  type="number"
                  name="billingZip"
                  id="billingZip"
                  autoComplete="billingZip"
                  maxLength="50"
                  min="0"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.zipCode = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                />
                {this.state.errors.zipCode && (
                  <FormErrors message="Please enter a zip code" />
                )}
              </div>
            </fieldset>

            {/* <div className={layout.col}>
            <label htmlFor="subscriber" className={form.booleancheckbox}>
              <input
                id="subscriber"
                type="checkbox"
                name="subscriber_to_the_ujet_blog"
                value="true"
              />
              <span className={form.check}>
                Subscribe to UJET's marketing blog{" "}
              </span>
            </label>
          </div> */}

            <div
              className={`${layout.col} ${form["mb-10px"]} ${
                this.state.errors.permission
                  ? form.error
                  : this.state.touched.permission
                  ? form.valid
                  : null
              }`}
            >
              <label
                htmlFor="permission"
                className={`${form.booleancheckbox} ${layout["d-flex"]}`}
              >
                <input
                  name="permission"
                  type="checkbox"
                  id="permission"
                  onChange={() => {
                    const touch = this.state.touched;
                    touch.permission = true;
                    this.setState({ touched: touch });
                    /* this.validate(); */
                  }}
                  onBlur={() => this.validate()}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.target.checked = !e.target.checked;
                    }
                  }}
                />
                <span className={form.check}>
                  <span className={form.required}>* </span>I confirm that I have
                  read and agree to UJET’s
                  <AgilityLink
                    agilityLink={{ href: "/privacy-notice/" }}
                    className={`${layout.link} ${form["mlr-5px"]}`}
                    aria-label="Read UJET's Privacy Policy"
                  >
                    Privacy Policy
                  </AgilityLink>
                  and
                  <AgilityLink
                    agilityLink={{ href: "/terms-of-service/" }}
                    className={`${layout.link} ${form["mlr-5px"]}`}
                    aria-label="Read UJET's Terms of Service"
                  >
                    Terms of Service
                  </AgilityLink>
                  .
                </span>
              </label>
              {this.state.errors.permission && (
                <FormErrors message="Read UJET's Privacy Statement and Terms of Services and check box" />
              )}
            </div>

            {/* START: Honeypot */}
            <label className={form.removehoney} htmlFor="honeyname"></label>
            <input
              className={form.removehoney}
              autoComplete="off"
              type="text"
              id="honeyname"
              name="honeyname"
              tabIndex="-1"
              aria-hidden="true"
            />
            <label className={form.removehoney} htmlFor="honeyemail"></label>
            <input
              className={form.removehoney}
              autoComplete="off"
              type="email"
              id="honeyemail"
              name="honeyemail"
              tabIndex="-1"
              aria-hidden="true"
            />
            {/* END: Honeypot */}

            <p className={form.paragraph}>
              We&#x27;re commited to your privacy. UJET uses the information
              provided to contact you about relevant content, products, and
              services. You may unsubscribe from these communications at any
              time. For more information, check out our
              <AgilityLink
                agilityLink={{ href: "/privacy-notice/" }}
                className={`${layout.bold} ${form["mlr-5px"]}`}
                ariaLabel="Read UJET's Privacy Policy"
              >
                Privacy Policy.
              </AgilityLink>
            </p>
            {/* <div className={layout.col}>
              <Button
                color="btn-navy"
                size="btn-big"
                text="Continue"
                type="submit"
                disable={this.props.loading}
              />
            </div> */}
          </form>
        </div>
        {!this.props.loading && (
          <ButtonFooter
            prevStep={`/subscription-cycle/${this.context.formData?.primaryId}`}
            onContinue={(e) => {
              e.stopPropagation();
              this.handleSubmit();
            }}
            scroll={this.state?.scroll ? layout.scroll : null}
          />
        )}
      </div>
    );
  }
}

export default ContactForm;
