const RichTextArea = ({ module }) => {
  const { fields } = module;
  return (
    <section className="section">
      <div
        className="container"
        dangerouslySetInnerHTML={{ __html: fields.textblob }}
      ></div>
    </section>
  );
};

export default RichTextArea;
