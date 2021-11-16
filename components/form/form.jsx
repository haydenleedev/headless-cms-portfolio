import { useEffect, useRef } from "react";

const Form = ({ submitButtonText, formLoaded }) => {
  const formRef = useRef(null);

  useEffect(() => {
    console.log(formLoaded);
    // override form's submit button text if provided
    if (formLoaded) {
      const submit = formRef.current.querySelector("button[type=submit");
      if (submit) submit.innerText = submitButtonText;
    }
  }, [formLoaded]);

  return <form id="mktoForm_1638" ref={formRef}></form>;
};

export default Form;
