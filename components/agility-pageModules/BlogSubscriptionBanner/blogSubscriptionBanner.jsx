import PardotForm from "../../form/pardotForm";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./blogSubscriptionBanner.module.scss";
import Heading from "../heading";
import { renderHTML } from "@agility/nextjs";

const BlogSubscriptionBanner = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const NEWSLETTER_FORM_ID = 3715;
  const NEWSLETTER_FORM_ACTION =
    "https://info.ujet.cx/l/986641/2022-08-05/kgtbr";
  return (
    <section
      className={`section ${style.blogSubscriptionBanner} ${
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
          <PardotForm
            formHandlerID={NEWSLETTER_FORM_ID}
            action={NEWSLETTER_FORM_ACTION}
            submit={fields.submitButtonText}
            btnColor="orange"
          />
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
