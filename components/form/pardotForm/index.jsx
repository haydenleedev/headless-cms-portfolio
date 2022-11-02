import { boolean } from "../../../utils/validation";
import LazyLoadReCAPTCHA from "../lazyLoadReCAPTCHA";
import FormContextProvider from "./context/formContext";
import StandardForm from "./form";
import StepForm from "./step";

const PardotForm = (props) => {
  const { stepsEnabled } = props;
  return (
    <FormContextProvider {...props}>
      <LazyLoadReCAPTCHA />
      {boolean(stepsEnabled) ? (
        <StepForm {...props} />
      ) : (
        <StandardForm {...props} />
      )}
      <noscript>
        <p>
          <strong>Please enable JavaScript to use the form.</strong>
        </p>
      </noscript>
    </FormContextProvider>
  );
};

export default PardotForm;
