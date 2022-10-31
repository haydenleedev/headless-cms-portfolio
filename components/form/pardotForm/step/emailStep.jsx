import style from "../form.module.scss";
import { useContext } from "react";
import PardotFormContext from "../context";
import { getFormType } from "../utils/helpers";
import FormError from "../../formError";
import { isEmail } from "../../../../shop/utils/validation";

const EmailStep = ({ stepFields }) => {
  const { setFieldsToMatchStep, formHandlerID } = useContext(PardotFormContext);
  const emailRef = useRef(null);
  const [emailError, setEmailError] = useState(false);
  const [stepFetchInProgress, setStepFetchInProgress] = useState(false);
  const formType = getFormType(this.props.formHandlerID);

  const validateEmail = () => {
    let validEmail = isEmail(emailRef.current.value);
    setEmailError(!validEmail);
    return validEmail;
  };

  const updateCurrentStep = async () => {
    setStepFetchInProgress(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getSubmittedPardotFields`,
      {
        method: "POST",
        body: JSON.stringify({
          email: emailRef.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    const submittedFields = responseJSON.submittedFields;
    const submittedFieldKeys = Object.keys(submittedFields);
    const submittedFieldNames = [];
    submittedFieldKeys.forEach((key) => {
      if (submittedFields[key]) {
        submittedFieldNames.push(key);
      }
    });
    const stepFieldKeys = Object.keys(stepFields);
    let currentStep = null;
    stepFieldKeys.some((key) => {
      if (key.includes(formType)) {
        stepFields[key].some((field) => {
          if (!submittedFieldNames.includes(field.fields.name)) {
            currentStep = key;
            return true;
          }
        });
      }
      if (currentStep) {
        return true;
      }
    });
    stepFetchInProgress(false);
    setFieldsToMatchStep(currentStep, emailRef.current.value);
  };

  return (
    <>
      <div>
        <label htmlFor="stepEmail">
          <span className={style.required}>*</span> Email
        </label>
        <input
          name="stepEmail"
          ref={emailRef}
          onBlur={() => {
            validateEmail();
          }}
        />
        {emailError && <FormError message={"Please enter a valid email"} />}
      </div>
      <div className="layout mt-4 d-flex flex-direction-column align-items-center">
        <button
          className="button orange"
          onClick={(e) => {
            e.preventDefault();
            if (validateEmail() && !stepFetchInProgress) {
              updateCurrentStep();
            }
          }}
        >
          {stepFetchInProgress ? "Please wait..." : "Next"}
        </button>
      </div>
    </>
  );
};

export default EmailStep;
