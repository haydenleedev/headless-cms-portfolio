import PardotForm from "../form/pardotForm";

const Subscribe = ({ pardotFormData }) => {
  const NEWSLETTER_FORM_ID = 3568; // Replace this with an appropriate ID later
  return (
    <div className="subscribe-blog">
      <span className="subscribe-blog--heading">Subscribe</span>
      <p className="subscribe-blog--title">
        The best customer experience content delivered right to your inbox.
      </p>
      <PardotForm
        fieldData={pardotFormData.formHandlerFieldsResponse.values}
        formHandlerID={NEWSLETTER_FORM_ID}
      />
    </div>
  );
};

export default Subscribe;
