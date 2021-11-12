import { boolean } from "../../../utils/validation";
import style from "./richTextArea.module.scss";

const RichTextArea = ({ module }) => {
  const { fields } = module;
  const fullContainerWidth = boolean(fields.fullContainerWidth);
  return (
    <section className={`section ${style.richTextArea}`}>
      <div
        className={`container content ${
          fullContainerWidth ? style.fullContainerWidthContent : style.content
        }`}
        dangerouslySetInnerHTML={{ __html: fields.textblob }}
      ></div>
    </section>
  );
};

export default RichTextArea;
