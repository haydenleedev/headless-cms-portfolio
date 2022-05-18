import { useState, useEffect, useRef } from "react";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import style from "./jobOpeningList.module.scss";

const JobOpeningList = ({ module, customData }) => {
  const { fields } = module;
  const { jobListJsonData } = customData;
  const heading = fields?.heading ? JSON.parse(fields.heading) : null;
  const searchInputRef = useRef();

  const sortJobsByLocation = () => {
    const jobsCopy = [...jobs];
    if (jobSortCategory == "location") {
      jobsCopy.reverse();
    } else {
      jobsCopy.sort((a, b) => {
        return a.location.name.localeCompare(b.location.name);
      });
      setJobSortCategory("location");
    }
    setJobs(jobsCopy);
  };

  const sortJobsByTitle = () => {
    const jobsCopy = [...jobs];
    if (jobSortCategory == "title") {
      jobsCopy.reverse();
    } else {
      jobsCopy.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      setJobSortCategory("title");
    }
    setJobs(jobsCopy);
  };

  const [jobSortCategory, setJobSortCategory] = useState(null);
  const [jobs, setJobs] = useState(jobListJsonData.jobs);
  const [locations, setLocations] = useState([]);
  const [locationFilter, setLocationFilter] = useState(null);

  useEffect(() => {
    sortJobsByTitle();
    const allLocations = [];
    jobListJsonData.jobs.forEach((job) => {
      if (!allLocations.includes(job.location.name)) {
        allLocations.push(job.location.name);
      }
    });
    setLocations(allLocations);
  }, []);

  useEffect(() => {
    filterByKeyword(searchInputRef.current.value);
  }, [locationFilter]);

  const filterByKeyword = (keyword) => {
    const jobsCopy = [...jobListJsonData.jobs];
    const searchTerm = keyword.toLowerCase();
    const jobsFilteredByKeyword = jobsCopy.filter(
      (job) =>
        (!searchTerm && !locationFilter) ||
        (job.title.toLowerCase().includes(searchTerm) &&
          (!locationFilter || job.location.name == locationFilter))
    );
    setJobs(jobsFilteredByKeyword);
  };

  const filterByLocation = (e) => {
    const selectedLocation = e.target.value;
    setLocationFilter(selectedLocation);
  };

  return (
    <>
      {jobListJsonData.jobs.length > 0 && (
        <section className={`section ${style.jobOpeningList}`}>
          {heading?.text && (
            <div className="heading mb-3">
              <Heading {...heading} />
            </div>
          )}
          <div className={`bg-lightgray pb-2`}>
            <fieldset className={`grid-columns container`}>
              <div className={`${style.filters} grid-column is-2`}>
                <label htmlFor="job-search-input">Keywords</label>
                <input
                  id="job-search-input"
                  type={"text"}
                  ref={searchInputRef}
                  onChange={(e) => {
                    filterByKeyword(e.target.value);
                  }}
                />
              </div>
              <div className={`${style.filters} grid-column is-2`}>
                <label htmlFor="job-location-dropdown">
                  Filter by location
                </label>
                <select
                  id="job-location-dropdown"
                  onChange={(e) => {
                    filterByLocation(e);
                  }}
                >
                  <option value="">All</option>
                  {locations.map((location, index) => {
                    return (
                      <option key={`location${index}`} value={location}>
                        {location}
                      </option>
                    );
                  })}
                </select>
              </div>
            </fieldset>
          </div>
          <div className="container mt-3">
            {jobs.length > 0 ? (
              <table className={style.jobOpenings}>
                <thead className={`bg-navy text-white`}>
                  <tr>
                    <th
                      tabIndex={0}
                      title="Sort jobs by title"
                      onClick={sortJobsByTitle}
                    >
                      Job Title
                    </th>
                    <th
                      tabIndex={0}
                      title="Sort jobs by location"
                      onClick={sortJobsByLocation}
                    >
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => {
                    return (
                      <tr key={`job${index}`} className={style.jobOpening}>
                        <td data-head="Job Title">
                          <AgilityLink
                            agilityLink={{ href: `/jobs/${job.id}` }}
                            ariaLabel={`Navigate to job opening page: ${job.title} (${job.location.name})`}
                          >
                            {job.title}
                          </AgilityLink>
                        </td>
                        <td data-head="Location">{job.location.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="mt-2">No results found.</p>
            )}
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
