import Button from "../buttons/button";
import { useRouter } from "next/dist/client/router";
import layout from "../../styles/layout.module.scss";
import modal from "./modal.module.scss";
import { useContext } from "react";
import GlobalContext from "../../../context";

const FreeLimitationModal = ({ onClick }) => {
  const router = useRouter();
  const { updateFormData } = useContext(GlobalContext);
  return (
    <div className={`${modal.modal} ${modal.narrow}`}>
      <p className={modal["section-title"]}>Free Trial Details</p>

      <ul className={modal["w-500px"]}>
        <li>Trial is limited to 90 days of platform usage</li>
        <li>
          Voice, Chat, and SMS usage are restricted to US Domestic usage only
        </li>
        <li>Voice: maximum of 5,000 minutes per month</li>
        <li>Chat: maximum of 100 sessions per month</li>
        <li>SMS: maximum of 100 messages per month</li>
        <li>Up to 2 US domestic phone numbers; Local or Toll-free</li>
        <li>No access to Contact Center AI features</li>
        <li>Starter Implementation included, support not included</li>
      </ul>
      <div className={`${layout["theme-padding"]}`}>
        <div
          className={`${layout.container} ${layout.grid} ${layout["align-center"]}`}
        >
          <div
            className={`${layout.row} ${layout["col-reverse"]} ${layout["justify-center"]}`}
          >
            <Button
              color="btn-blue"
              size="btn-small"
              text="No, I want to select a different plan"
              padding="mlr-7px"
              onClick={(e) => {
                onClick(e);
                document.querySelector("body").classList.remove("no-scroll");
              }}
            />
            <Button
              color="btn-orange"
              size="btn-small"
              text="Yes, let's get started!"
              padding="mlr-7px"
              onClick={(e) => {
                e.preventDefault();
                updateFormData({ freeFlow: true });
                router.push("/free-contact-information");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeLimitationModal;
