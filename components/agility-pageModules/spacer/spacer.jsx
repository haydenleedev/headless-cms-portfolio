const Spacer = ({ module }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${fields.classes ? fields.classes : ""}`}
    ></section>
  );
};

export default Spacer;
