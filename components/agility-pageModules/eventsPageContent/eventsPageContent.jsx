import style from "./eventsPageContent.module.scss";
import Link from "next/link";
import {
  toPacificDateTime,
  toPacificTimeMilliseconds,
} from "../../../utils/convert";

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
      <h1 className=""></h1>
      <div className="container">
        <nav className={style.eventsPageContent} aria-label="events navigation">
          {events &&
            events.map((event) => (
              <div className={style.event}>
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
                  <Link href={event.fields.link.href}>
                    <a className="button">
                      <span>{event.fields.link.text}</span>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
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
