import { useState } from "react";
import { Form, FormWrapper } from "../form";

const Subscribe = ({}) => {
  const [formLoaded, setFormLoaded] = useState(false);
  const NEWSLETTER_FORM_ID = "mktoForm_1024";
  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };
  return (
    <FormWrapper
      handleSetFormLoaded={handleSetFormLoaded}
      formID={NEWSLETTER_FORM_ID}
    >
      <div className="subscribe-blog">
        <span className="subscribe-blog--heading">Subscribe</span>
        <p className="subscribe-blog--title">
          The best customer experience content delivered right to your inbox.
        </p>
        <Form formLoaded={formLoaded} formID={NEWSLETTER_FORM_ID} />
      </div>
    </FormWrapper>
  );
};

export default Subscribe;
