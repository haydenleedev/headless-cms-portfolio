import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import style from "./jobOpeningList.module.scss";

const JobOpeningList = ({ module, customData }) => {
  const { fields } = module;
  const { jobListJsonData } = customData;
  const heading = fields?.heading ? JSON.parse(fields.heading) : null;
  return (
    <>
      {jobListJsonData.jobs.length > 0 && (
        <section className={`section ${style.jobOpeningList}`}>
          <div className="container">
            {heading?.text && (
              <div className="heading mb-3">
                <Heading {...heading} />
              </div>
            )}
            <div className={style.jobOpenings}>
              {jobListJsonData.jobs.map((job, index) => {
                return (
                  <AgilityLink
                    key={`joboOpening${index}`}
                    agilityLink={{ href: job.absolute_url }}
                    className={style.jobOpening}
                  >
                    <p className="bold">{job.title}</p>
                    <p>{job.location.name}</p>
                    <span>Learn more</span>
                  </AgilityLink>
                );
              })}
            </div>
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
