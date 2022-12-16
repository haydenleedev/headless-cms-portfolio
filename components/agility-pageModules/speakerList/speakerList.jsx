import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: true });
import Media from "../media";
import style from "./speakerList.module.scss";

const SpeakerList = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;

  const numberOfColumns = 3;
  const numberOfRows = Math.ceil(fields.speakers.length / numberOfColumns);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.speakerList}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <div className="container">
        <div className={style.heading}>
          <Heading {...heading} />
        </div>
        <div className={`grid-columns ${style.content}`}>
          {fields.speakers.map((speaker, index) => (
            <div
              className={`grid-column is-4 ${style.speaker} ${
                index % numberOfColumns == 0 ? "ml-0" : ""
              }
              ${
                index + 1 > (numberOfRows - 1) * numberOfColumns ? "mb-0" : ""
              }`}
              key={speaker.contentID}
            >
              <div className={style.speakerImage}>
                <Media media={speaker.fields.image} />
              </div>
              <div className="d-flex flex-direction-column justify-content-flex-start">
                <p>{speaker.fields.name}</p>
                <p>{speaker.fields.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakerList;
