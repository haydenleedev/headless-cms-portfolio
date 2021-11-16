import { useState } from "react";
import style from "./textWithForm.module.scss";
import { Form, FormWrapper } from "../../form";

const TextWithForm = ({ module }) => {
  const [formLoaded, setFormLoaded] = useState(false);
  const { fields } = module;

  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };

  return (
    <FormWrapper handleSetFormLoaded={handleSetFormLoaded}>
      <section
        className={`section ${style.textWithForm} ${
          fields.classes ? fields.classes : ""
        }`}
      >
        <div className="container">
          <div className={style.content}>
            <aside
              className={`content ${style.textContent}`}
              dangerouslySetInnerHTML={{ __html: fields.text }}
            ></aside>
            <aside className={style.form}>
              <Form
                submitButtonText={fields.formSubmitText}
                formLoaded={formLoaded}
              />
            </aside>
          </div>
        </div>
      </section>
    </FormWrapper>
  );
};

export default TextWithForm;
