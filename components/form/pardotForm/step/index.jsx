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
import { getNextStepIndex } from "../utils/helpers";

const StepForm = ({
  customAction,
  btnColor,
  submit,
  config,
  stepCompletion,
}) => {
  const {
    state,
    fieldRefs,
    formRef,
    handleSubmit,
    isContactForm,
    updateCurrentStep,
  } = useContext(PardotFormContext);
  const isFirstStep =
    !state.stepEmailFieldValue && !state.prefilledCompletionView;
  const isStep =
    state.currentStepIndex < config.steps.length &&
    !state.prefilledCompletionView;
  const stepsCompleted = state.prefilledCompletionView;

  const handleStepFormSubmit = (e) => {
    e.preventDefault();
    // if this step is the final step, submit the form
    if (state.currentStepIndex === config.steps.length - 1) {
      handleSubmit(e, true);
    } else {
      if (!state.formErrors.includes(true))
        // it's assumed that the step form email is already in the form state
        updateCurrentStep({
          steps: config.steps,
        });
    }
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
              value={
                state.submissionInProgress
                  ? "Please wait..."
                  : state.currentStepIndex === config.steps.length - 1 ||
                    typeof getNextStepIndex(
                      state.currentStepIndex,
                      state.submittedStepFields
                    ) !== "number"
                  ? submit
                  : "Next"
              }
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
