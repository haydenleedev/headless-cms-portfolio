import PardotFormContext from "./context";
import Field from "./field";
import style from "./form.module.scss";
import { getFormType } from "./utils/helpers";

const StandardForm = ({ customAction, action, btnColor, submit }) => {
  const { state, formRef, handleSubmit } = useContext(PardotFormContext);
  const isContactForm = getFormType(state.formType) === "contactUs";
  return (
    <form
      action={customAction ? null : action}
      method={customAction ? null : "post"}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      autoComplete={isContactForm ? "off" : "on"}
      className={style.pardotForm}
      style={{ display: state.clientJSEnabled ? "" : "none" }}
      ref={formRef}
    >
      {state.fieldData?.map((field, index) => (
        <Field field={field} index={index} />
      ))}

      {(state.includeTimeStampInEmailAddress || state.stepEmailFieldValue) && (
        <input name="hiddenemail" className="display-none" />
      )}
      <HoneypotFields />
      <div className="layout mt-4 d-flex flex-direction-column align-items-center">
        <input
          type="submit"
          className={`button ${btnColor ? btnColor : "orange"}`}
          value={state.submissionInProgress ? "Please wait..." : submit}
          required="required"
        />
        {!state.submissionAllowed && (
          <FormError
            message={"Something went wrong. Please try again later."}
          />
        )}
      </div>
    </form>
  );
};

export default StandardForm;
