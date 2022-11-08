import PardotForm from "../../form/pardotForm";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./blogSubscriptionBanner.module.scss";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
import { renderHTML } from "@agility/nextjs";
import { useState } from "react";
import Image from "next/image";

const BlogSubscriptionBanner = ({ module, customData }) => {
  const [successView, setSuccessView] = useState(null);
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const NEWSLETTER_FORM_ID = 3715;
  const NEWSLETTER_FORM_ACTION =
    "https://info.ujet.cx/l/986641/2022-08-05/kgtbr";

  const customAction = (success) => {
    if (success) setSuccessView("Thank you! You have been subscribed.");
    else setSuccessView("An unexpected error occured. Please try again later.");
  };

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${mtValue} ${mbValue} ${ptValue} ${pbValue}
      ${style.blogSubscriptionBanner} ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
    >
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
    </section>
  );
};

BlogSubscriptionBanner.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default BlogSubscriptionBanner;
