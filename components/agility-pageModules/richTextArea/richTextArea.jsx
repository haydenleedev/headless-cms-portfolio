import { boolean } from "../../../utils/validation";
import style from "./richTextArea.module.scss";

const RichTextArea = ({ module }) => {
  const { fields } = module;
  const fullContainerWidth = boolean(fields?.fullContainerWidth);
  const alignCenter = boolean(fields?.alignCenter);

  return (
    <section
      className={`section ${style.richTextArea} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div
        className={`container content ${
          fullContainerWidth ? style.fullContainerWidthContent : style.content
        } ${alignCenter ? "align-center" : ""}`}
        dangerouslySetInnerHTML={{ __html: fields.textblob }}
      ></div>
    </section>
  );
};

export default RichTextArea;
