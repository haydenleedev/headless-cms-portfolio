import { useContext } from "react";
import { cn } from "../../../../utils/generic";
import PardotFormContext from "../context";
import FieldResolver from "./resolver";

const Field = (props) => {
  const { field, index } = props;
  const { state, handleDispatch } = useContext(PardotFormContext);
  const isFirstPartnerFieldIndex =
    state.firstPartnerFieldIndex === null &&
    field.name.toLowerCase().match(/partner/) &&
    !field.name.toLowerCase().match(/partner area of interest/) &&
    !isHiddenField(field, isDealRegistrationForm);
  const shouldBeHiddenStateSelect =
    field.name.toLowerCase().match(/state/) &&
    ((!field.name.toLowerCase().match(/partner/) && !state.stateFieldVisible) ||
      (field.name.toLowerCase().match(/partner/) &&
        !state.partnerStateFieldVisible));

  if (isFirstPartnerFieldIndex) {
    handleDispatch({
      type: pardotFormActions.setFirstPartnerFieldIndex,
      value: index,
    });
  }
  return (
    <div
      key={`formField${index}`}
      className={cn({
        "display-none":
          isHiddenField(field, isDealRegistrationForm) ||
          shouldBeHiddenStateSelect,
        [style.error]: state.errors[index],
        [style.valid]: state.touched[index],
      })}
    >
      {!isHiddenField(field, isDealRegistrationForm) && (
        <>
          {index == state.firstPartnerFieldIndex && (
            <p
              className={cn([
                "heading-6",
                style["pt-3"],
                style["mt-3"],
                style["pb-2"],
                style["bt-1"],
              ])}
            >
              {isDealRegistrationForm
                ? "Your Information"
                : isChannelRequestForm
                ? "Partner Information"
                : null}
            </p>
          )}
          <label htmlFor={field.id}>
            {field.isRequired && <span className={style.required}>*</span>}{" "}
            {field.name.toLowerCase() === "company"
              ? "Company Name"
              : field.name.toLowerCase() === "email"
              ? "Work Email"
              : field.name}
          </label>
        </>
      )}
      <FieldResolver {...props} />
      {state.errors[index] && (
        <FormError
          message={
            state.pasteError && state.pasteError.index === index
              ? state.pasteError.msg
              : getErrorMessage(field.name)
          }
        />
      )}
    </div>
  );
};

export default Field;
