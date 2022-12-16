import style from "./blogSubscriptionBanner.module.scss";
import dynamic from "next/dynamic";
import { renderHTML } from "@agility/nextjs";
import { useState } from "react";
import Image from "next/image";
const Heading = dynamic(() => import("../heading"), { ssr: true });
const PardotForm = dynamic(() => import("../../form/pardotForm"), {
  ssr: false,
});

const BlogSubscriptionBannerContent = ({ fields, sanitizedHtml }) => {
  const [successView, setSuccessView] = useState(null);
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const NEWSLETTER_FORM_ID = 3715;
  const NEWSLETTER_FORM_ACTION =
    "https://info.ujet.cx/l/986641/2022-08-05/kgtbr";

  const customAction = (success) => {
    if (success) setSuccessView("Thank you! You have been subscribed.");
    else setSuccessView("An unexpected error occured. Please try again later.");
  };

  return (
    <div className={`container ${style.content}`}>
      <div className={style.textContent}>
        {heading && (
          <div className={`heading ${style.heading}`}>
            <Heading {...heading} />
          </div>
        )}
        {fields.text && (
          <div
            className={style.text}
            dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
          ></div>
        )}
      </div>
      <div className={style.form}>
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
            submit={fields.submitButtonText}
            btnColor="orange"
          />
        )}
      </div>
    </div>
  );
};

export default BlogSubscriptionBannerContent;
