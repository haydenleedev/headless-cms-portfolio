import style from "../form.module.scss";
import { useContext, useRef, useState } from "react";
import PardotFormContext from "../context";
import FormError from "../../formError";
import { isEmail } from "../../../../shop/utils/validation";
import { cn } from "../../../../utils/generic";

const EmailStep = ({ steps }) => {
  const { state, updateCurrentStep, handleSetStepEmailFieldValue } =
    useContext(PardotFormContext);
  const emailRef = useRef(null);
  const [emailError, setEmailError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const validateEmail = () => {
    let validEmail = isEmail(emailRef.current.value);
    setEmailError(!validEmail);
    return validEmail;
  };

  return (
    <>
      <label
        className={cn({
          [style.error]: emailError,
          [style.valid]: emailTouched && !emailError,
        })}
        style={{ gridColumn: "1 / -1" }}
      >
        <span>
          <span className={style.required}>*</span> Email
        </span>
        <input
          name="stepEmail"
          ref={emailRef}
          onBlur={() => {
            setEmailTouched(true);
            validateEmail();
          }}
        />
        {emailError && <FormError message={"Please enter a valid email"} />}
      </label>
      <div
        className="layout mt-4 d-flex flex-direction-column align-items-center"
        style={{ gridColumn: "1 / -1" }}
      >
        <button
          className="button orange"
          onClick={(e) => {
            if (validateEmail() && !state.stepFetchInProgress) {
              e.preventDefault();
              handleSetStepEmailFieldValue(emailRef.current.value);
              updateCurrentStep({ steps, email: emailRef.current.value });
            }
          }}
        >
          {state.stepFetchInProgress ? "Please wait..." : "Next"}
        </button>
      </div>
    </>
  );
};

export default EmailStep;
