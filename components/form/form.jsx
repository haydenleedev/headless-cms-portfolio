import { useEffect, useRef, useState } from "react";
import { formSubmissionEvent, formSuccessEvent } from "../../utils/dataLayer";
import { FormLoader } from "../agility-pageModules/textWithForm/textWithForm";

const Form = ({ submitButtonText, formLoaded, formID }) => {
  const formRef = useRef(null);
  // do this to allow the marketo form ID being input in format "mktoForm_1638" or just "1638"
  const marketoFormID = formID
    ? parseInt(formID.split("_")[formID.split("_").length - 1])
    : null;

  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    // if (formLoaded && submitButtonText && formRef.current) {
    // const submit = formRef.current.querySelector("button[type=submit]");
    // if (submit) submit.innerText = submitButtonText;
    // }
    // override form's submit button text if provided
    var observer = new MutationObserver(function (mutations) {
      const submit = formRef.current.querySelector("button[type=submit]");

      if (submit && submitButtonText) submit.innerText = submitButtonText;

      if (formRef.current && !formRef.current.innerHTML) {
        setLoaderVisible(true);
      } else if (document.getElementById("mktoForm_loader")) {
        setLoaderVisible(false);

        // GTM form submission event through data layer
        formRef.current.addEventListener("submit", (e) => {
          formSubmissionEvent({});
          // Create success event here for now
          formSuccessEvent({});
        });
      }
    });
    if (marketoFormID) {
      var form = document.getElementById(`mktoForm_${marketoFormID}`);
      if (form)
        observer.observe(form, {
          attributes: true,
        });
    }
  }, []);

  return marketoFormID ? (
    <>
      <form
        id={`mktoForm_${marketoFormID}`}
        ref={formRef}
        className={`marketoForm ${formLoaded ? "is-hidden" : ""}`}
      ></form>
      {loaderVisible && <FormLoader />}
    </>
  ) : null;
};

export default Form;
