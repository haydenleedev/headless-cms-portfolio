import style from "./richTextArea.module.scss";

const RichTextArea = ({ module }) => {
  const { fields } = module;
  return (
    <section className={`section ${style.richTextArea}`}>
      <div
        className={`container content ${style.content}`}
        dangerouslySetInnerHTML={{ __html: fields.textblob }}
      ></div>
    </section>
  );
};

export default RichTextArea;
