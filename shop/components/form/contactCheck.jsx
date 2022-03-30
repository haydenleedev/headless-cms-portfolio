import { Component } from "react";
import Button from "../buttons/button";
import FormErrors from "./errors";
import layout from "../../styles/layout.module.scss";
import form from "./form.module.scss";
import { isEmail } from "../../utils/validation";
import ButtonFooter from "../buttons/button-footer";

class ContactCheckForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);

    this.state = {
      errors: {
        email: false,
      },
      scroll: false,
    };
  }

  validate(event) {
    const email = event.target.value;
    event.preventDefault();
    let flag = true;

    this.setState({
      errors: {
        email: false,
      },
    });

    // Validating email
    if (!email || !isEmail(email)) {
      this.setState({ errors: { email: true } });
      flag = false;
    }
    return flag;
  }

  handleSubmit(event) {
    event.preventDefault();
    // Validating
    if (!this.state.errors.email && this.form.email.value) {
      this.props.lookupSalesForce(this.form.email.value);
    } else {
      this.setState({ errors: { email: true } });
    }
  }

  componentDidMount() {
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
            id="contactCheck"
            action=""
            onSubmit={this.handleSubmit}
            ref={(form) => (this.form = form)}
          >
            <fieldset className={layout.row}>
              <div
                className={`${layout.col} ${layout["col-12"]} ${
                  this.state.errors.email
                    ? form.error
                    : this.form?.email?.value
                    ? form.valid
                    : null
                }`}
              >
                <label htmlFor="email">
                  <span className={form.required}>*</span> Email
                </label>
                <input
                  name="email"
                  id="email"
                  autoComplete="email"
                  maxLength="50"
                  disabled={this.props.loading}
                  onChange={this.validate}
                />
                {this.state.errors.email && (
                  <FormErrors message="Please enter a valid company email." />
                )}
              </div>
            </fieldset>
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
            prevStep={`/subscription-cycle/${this.props.formData?.primaryId}`}
            onContinue={this.handleSubmit}
            scroll={this.state?.scroll ? layout.scroll : null}
          />
        )}
      </div>
    );
  }
}

export default ContactCheckForm;
