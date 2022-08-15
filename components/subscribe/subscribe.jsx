import PardotForm from "../form/pardotForm";

const Subscribe = ({ formConfiguration }) => {
  const NEWSLETTER_FORM_ID = 3715;
  const NEWSLETTER_FORM_ACTION =
    "https://info.ujet.cx/l/986641/2022-08-05/kgtbr";
  return (
    <div className="subscribe-blog">
      <span className="subscribe-blog--heading">Subscribe</span>
      <p className="subscribe-blog--title">
        The best customer experience content delivered right to your inbox.
      </p>
      <PardotForm
        formHandlerID={NEWSLETTER_FORM_ID}
        action={NEWSLETTER_FORM_ACTION}
        submit="Subscribe to UJET Blog"
        config={formConfiguration}
        btnColor="navy"
      />
    </div>
  );
};

export default Subscribe;
