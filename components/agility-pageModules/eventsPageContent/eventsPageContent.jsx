import style from "./eventsPageContent.module.scss";
import {
  toPacificDateTime,
  toPacificTimeMilliseconds,
} from "../../../utils/convert";
import dynamic from "next/dynamic";
import OverrideSEO from "../../agility-pageModules/overrideSEO/overrideSEO";
import { event } from "../../../schema";
const Heading = dynamic(() => import("../heading"));
const AgilityLink = dynamic(() => import("../../agilityLink"));

const EventsPageContent = ({ module, customData }) => {
  const { allEvents } = customData;
  const events = allEvents
    .filter(
      (event) =>
        toPacificTimeMilliseconds(new Date()) <
        toPacificTimeMilliseconds(new Date(event.fields.endTime))
    )
    .reverse();
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  return (
    <>
      {events.length > 0 && (
        <OverrideSEO
          module={{ fields: {} }}
          additionalSchemas={[
            JSON.stringify(
              events.map((eventItem) =>
                event({
                  name: eventItem.fields.title,
                  startDate: eventItem.fields.startTime,
                  endDate: eventItem.fields.endTime,
                  location: {
                    place:
                      eventItem.fields.location ||
                      eventItem.fields.description.split("at ")[1],
                    url: eventItem.fields.link.href,
                  },
                  eventType: eventItem.fields.eventType,
                  description: eventItem.fields.description,
                })
              )
            ),
          ]}
        />
      )}
      <section className="section">
        {events && fields.heading && (
          <div className={style.heading}>
            <Heading {...heading}></Heading>
          </div>
        )}

        <div className="container">
          <nav
            className={style.eventsPageContent}
            aria-label="events navigation"
          >
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
              ))) || (
              <p className="align-center">
                We currently have no events! Please check back soon!
              </p>
            )}
          </nav>
        </div>
      </section>
    </>
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
    take: 250,
    sort: "fields.startTime",
    direction: "desc",
  });

  return { allEvents: [...events.items] };
};

export default EventsPageContent;
