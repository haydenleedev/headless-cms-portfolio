import { useEffect, useRef, useState } from "react";
import { sleep } from "../../utils/generic";
import { FormLoader } from "../agility-pageModules/textWithForm/textWithForm";

const Form = ({ submitButtonText, formLoaded, formID }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  // do this to allow the marketo form ID being input in format "mktoForm_1638" or just "1638"
  const marketoFormID = formID
    ? parseInt(formID.split("_")[formID.split("_").length - 1])
    : null;

  useEffect(() => {
    // if (formLoaded && submitButtonText && formRef.current) {
    // const submit = formRef.current.querySelector("button[type=submit]");
    // if (submit) submit.innerText = submitButtonText;
    // }

    // override form's submit button text if provided
    var observer = new MutationObserver(function (mutations) {
      const submit = formRef.current.querySelector("button[type=submit]");
      if (submit) submit.innerText = submitButtonText;
    });
    if (marketoFormID) {
      var form = document.getElementById(`mktoForm_${marketoFormID}`);
      if (form)
        observer.observe(form, {
          attributes: true,
        });
    }
  }, [formLoaded, submitButtonText]);

  return marketoFormID ? (
    <>
      <form
        id={`mktoForm_${marketoFormID}`}
        ref={formRef}
        className={`marketoForm ${formLoaded ? "is-hidden" : ""}`}
      ></form>
      {/* {!formLoaded && <FormLoader/>} */}
      {/* <FormLoader></FormLoader> */}
    </>
  ) : null;
};

export default Form;
