import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import style from "./jobOpeningList.module.scss";

const JobOpeningList = ({ module, customData }) => {
  const { fields } = module;
  const { jobListJsonData } = customData;
  const heading = fields?.heading ? JSON.parse(fields.heading) : null;
  const jobsByLocation = [];

  jobListJsonData.jobs.forEach((job) => {
    let locationInArray = false;
    jobsByLocation.forEach((locationCategory) => {
      if (job.location.name == locationCategory.location) {
        locationCategory.jobs.push(job);
        locationInArray = true;
      }
    });
    if (!locationInArray) {
      jobsByLocation.push({ location: job.location.name, jobs: [job] });
    }
  });

  jobsByLocation.sort((a, b) => {
    return a.location.localeCompare(b.location);
  });

  return (
    <>
      {jobsByLocation.length > 0 && (
        <section className={`section ${style.jobOpeningList}`}>
          <div className="container">
            {heading?.text && (
              <div className="heading mb-3">
                <Heading {...heading} />
              </div>
            )}
            {jobsByLocation.map((locationCategory, locationCategoryIndex) => {
              return (
                <div
                  key={`locationCategory${locationCategoryIndex}`}
                  className={style.locationCategory}
                >
                  <h3 className="heading-5 mb-3">
                    {locationCategory.location}
                  </h3>
                  <div className={style.jobOpenings}>
                    {locationCategory.jobs.map((job, jobIndex) => {
                      return (
                        <AgilityLink
                          key={`joboOpening${jobIndex}`}
                          agilityLink={{ href: `/jobs/${job.id}` }}
                          className={style.jobOpening}
                        >
                          <p className="bold">{job.title}</p>
                          <span>Learn more</span>
                        </AgilityLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

JobOpeningList.getCustomInitialProps = async function () {
  const jobListData = await fetch(
    process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT,
    { method: "GET" }
  );
  const jobListJsonData = await jobListData.json();
  return { jobListJsonData };
};

export default JobOpeningList;
