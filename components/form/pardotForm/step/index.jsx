import FormError from "../../formError";
import HoneypotFields from "../../honeypotFields";
import Field from "../field";
import PardotFormContext from "../context";
import style from "../form.module.scss";
import EmailStep from "./emailStep";
import { Fragment, useContext } from "react";
import Loader from "../../../layout/loader/loader";
import { cn } from "../../../../utils/generic";
import ResourceDownloadContent from "../../../agility-pageModules/resourceDownload/resourceDownloadContent";

// idea: the user submits the form several times based on the number of steps defined in Agility
// the email of the user is always checked first.
// then the step that's submitted this time is defined based on if the user has previously submitted (every time a form is submitted, the values are saved on FaunaDB).
const StepForm = ({
  customAction,
  btnColor,
  submit,
  config,
  stepCompletion,
}) => {
  const { state, fieldRefs, formRef, handleSubmit, isContactForm } =
    useContext(PardotFormContext);

  const isFirstStep =
    !state.stepEmailFieldValue && !state.prefilledCompletionView;
  const isStep = state.stepEmailFieldValue && !state.prefilledCompletionView;
  const stepsCompleted = state.prefilledCompletionView;

  const handleStepFormSubmit = (e) => {
    handleSubmit(e, true);
  };

  if (isFirstStep) {
    return (
      <form
        className={style.pardotForm}
        ref={formRef}
        style={{ display: state.clientJSEnabled ? "" : "none" }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        autoComplete={isContactForm ? "off" : "on"}
      >
        <EmailStep steps={config.steps} />
        <HoneypotFields />
      </form>
    );
  } else if (isStep) {
    return (
      <>
        {(state.stepFetchInProgress || state.submissionInProgress) && (
          <Loader />
        )}
        <form
          action={state.action}
          method={customAction ? null : "post"}
          onSubmit={handleStepFormSubmit}
          autoComplete={isContactForm ? "off" : "on"}
          className={cn({
            [style.pardotForm]: true,
            [style.isHidden]:
              state.stepFetchInProgress || state.submissionInProgress,
          })}
          style={{ display: state.clientJSEnabled ? "" : "none" }}
          ref={formRef}
        >
          {state.fieldData?.map((field, index) => (
            <Fragment key={`stepField${index}`}>
              <Field
                field={field}
                index={index}
                fieldRef={fieldRefs.current[index]}
              />
            </Fragment>
          ))}

          {(state.includeTimeStampInEmailAddress ||
            state.stepEmailFieldValue) && (
            <input name="hiddenemail" className="display-none" />
          )}
          <HoneypotFields />
          <div className={style.submitButton}>
            <input
              type="submit"
              className={`button ${btnColor ? btnColor : "orange"}`}
              value={state.submissionInProgress ? "Please wait..." : submit}
              required="required"
              disabled={state.submissionInProgress}
            />
            {!state.submissionAllowed && (
              <FormError
                message={"Something went wrong. Please try again later."}
              />
            )}
          </div>
        </form>
      </>
    );
  } else if (stepsCompleted) {
    return (
      <>
        {stepCompletion ? (
          <ResourceDownloadContent resourceDownload={{ ...stepCompletion }} />
        ) : (
          <p>Thank you for contacting us.</p>
        )}
      </>
    );
  }
};

export default StepForm;
