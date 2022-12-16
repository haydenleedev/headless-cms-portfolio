import dynamic from "next/dynamic";
import style from "./jobOpeningList.module.scss";
const JobOpeningListContent = dynamic(() => import("./jobOpeningListContent"));

const JobOpeningList = ({ module, customData }) => {
  const { fields } = module;
  const { jobListData } = customData;

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <>
      {jobListData.length > 0 && (
        <section
          className={`section ${style.jobOpeningList}
          ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
            fields?.backgroundColor ? fields?.backgroundColor : ""
          }`}
        >
          <JobOpeningListContent fields={fields} jobListData={jobListData} />
        </section>
      )}
    </>
  );
};

JobOpeningList.getCustomInitialProps = async function () {
  const fetchedData = await fetch(
    process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT,
    { method: "GET" }
  );
  const fetchedDataJson = await fetchedData.json();
  let jobListData = [];
  fetchedDataJson.jobs.forEach((job) => {
    let employmentType;
    if (job.metadata.length > 0) {
      job.metadata.forEach((meta) => {
        if (meta.name.toLowerCase() == "employment type") {
          employmentType = meta.value ? meta.value : "Unspecified";
        }
      });
    }
    jobListData.push({
      location: job.location.name.trim(),
      title: job.title,
      employmentType: employmentType,
      id: job.id,
    });
  });
  jobListData = jobListData.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  return { jobListData };
};

export default JobOpeningList;
