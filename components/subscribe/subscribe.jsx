import PardotForm from "../form/pardotForm";
import pardotFormData from "../../data/pardotFormData.json";

const Subscribe = ({ formConfiguration }) => {
  const NEWSLETTER_FORM_ID = 3568; // Replace this with an appropriate ID later
  return (
    <div className="subscribe-blog">
      <span className="subscribe-blog--heading">Subscribe</span>
      <p className="subscribe-blog--title">
        The best customer experience content delivered right to your inbox.
      </p>
      <PardotForm
        fieldData={pardotFormData}
        formHandlerID={NEWSLETTER_FORM_ID}
        config={formConfiguration}
      />
    </div>
  );
};

export default Subscribe;
