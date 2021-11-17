import { useEffect, useRef } from "react";
import FormLoader from "./formLoader";

const Form = ({ submitButtonText, formLoaded }) => {
  const formRef = useRef(null);

  useEffect(() => {
    // override form's submit button text if provided
    if (formLoaded) {
      const submit = formRef.current.querySelector("button[type=submit");
      if (submit) submit.innerText = submitButtonText;
    }
  }, [formLoaded]);

  return (
    <>
      <form id="mktoForm_1638" ref={formRef}></form>
      {!formLoaded && <FormLoader />}
    </>
  );
};

export default Form;
