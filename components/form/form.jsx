import { useEffect, useRef, useState } from "react";
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

    // override form's submit button text if provided
    if (formLoaded && submitButtonText && formRef.current) {
      const submit = formRef.current.querySelector("button[type=submit]");
      if (submit) submit.innerText = submitButtonText;
    }
  }, [formLoaded]);

  return marketoFormID ? (
    <>
      <form
        id={`mktoForm_${marketoFormID}`}
        ref={formRef}
        className={`marketoForm ${formLoaded ? "is-hidden" : ""}`}
      ></form>
      {!formLoaded && <FormLoader/>}
      {/* <FormLoader></FormLoader> */}
    </>
  ) : null;
};

export default Form;
