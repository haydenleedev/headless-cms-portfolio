import style from "./eventsPageContent.module.scss";
import {
  toPacificDateTime,
  toPacificTimeMilliseconds,
} from "../../../utils/convert";
import AgilityLink from "../../agilityLink";

const EventsPageContent = ({ customData }) => {
  const { allEvents } = customData;
  const events = allEvents
    .filter(
      (event) =>
        toPacificTimeMilliseconds(new Date()) <
        toPacificTimeMilliseconds(new Date(event.fields.startTime))
    )
    .reverse();

  return (
    <section className="section">
      {events.fields.title && <h1 className="title">{events.fields.title}</h1>}
      {events.fields.subTitle && <h2>{events.fields.subTitle}</h2>}
      <div className="container">
        <nav className={style.eventsPageContent} aria-label="events navigation">
          {(events &&
            events.length > 0 &&
            events.map((event) => (
              <div className={style.event} key={event.contentID}>
                <p className={style.eventType}>{event.fields.eventType}</p>
                <p className={style.eventTitle}>{event.fields.title}</p>
                <p className={style.eventDescription}>
                  {event.fields.description}
                </p>
                {event.fields.location && (
                  <p className={style.eventLocation}>
                    <img
                      src="https://assets.ujet.cx/location.svg"
                      width="22"
                      height="22"
                    />
                    {event.fields.location}
                  </p>
                )}
                <p className={style.eventTime}>
                  <img
                    src="https://assets.ujet.cx/time.svg"
                    width="22"
                    height="22"
                  />
                  {`${toPacificDateTime(
                    event.fields.startTime
                  )} - ${toPacificDateTime(event.fields.endTime)}`}
                </p>

                <div className={style.eventLink}>
                  <AgilityLink
                    agilityLink={event.fields.link}
                    className="button"
                  >
                    <span>{event.fields.link.text}</span>
                  </AgilityLink>
                </div>
              </div>
            ))) || <p className="align-center">Nothing here.</p>}
        </nav>
      </div>
    </section>
  );
};

EventsPageContent.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;
  const events = await api.getContentList({
    referenceName: "events",
    languageCode,
    take: 50,
    sort: "fields.startTime",
    direction: "desc",
  });

  return { allEvents: [...events.items] };
};

export default EventsPageContent;
