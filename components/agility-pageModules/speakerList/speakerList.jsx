import Heading from "../heading";
import Media from "../media";
import style from "./speakerList.module.scss";

const SpeakerList = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;

  return (
    <section
      className={`section ${style.speakerList} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className="container">
        <div className={style.heading}>
          <Heading {...heading} />
        </div>
        <div className={`grid-columns ${style.content}`}>
          {fields.speakers.map((speaker) => (
            <div
              className={`grid-column is-4 ${style.speaker}`}
              key={speaker.contentID}
            >
              <div className={style.speakerImage}>
                <Media media={speaker.fields.image} />
              </div>
              <div>
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
