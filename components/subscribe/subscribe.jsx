import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import style from "./subscribe.module.scss";
const PardotForm = dynamic(() => import("../form/pardotForm"));

const Subscribe = ({ formConfiguration }) => {
  const [successView, setSuccessView] = useState(null);
  const NEWSLETTER_FORM_ID = 3715;
  const NEWSLETTER_FORM_ACTION =
    "https://info.ujet.cx/l/986641/2022-08-05/kgtbr";

  const customAction = (success) => {
    if (success) setSuccessView("Thank you! You have been subscribed.");
    else setSuccessView("An unexpected error occured. Please try again later.");
  };

  return (
    <div className="subscribe-blog">
      <span className="subscribe-blog--heading">Subscribe</span>
      <p className="subscribe-blog--title">
        The best customer experience content delivered right to your inbox.
      </p>

      {successView ? (
        <div className={`${style.success} fadeIn`}>
          <Image src="/success-blue.png" height={54} width={54} />
          <p className="heading-6">
            Thank you!<br></br> You have been subscribed.
          </p>
        </div>
      ) : (
        <PardotForm
          formHandlerID={NEWSLETTER_FORM_ID}
          action={NEWSLETTER_FORM_ACTION}
          customAction={customAction}
          submit="Subscribe to UJET Blog"
          config={formConfiguration}
          btnColor="navy"
        />
      )}
    </div>
  );
};

export default Subscribe;
