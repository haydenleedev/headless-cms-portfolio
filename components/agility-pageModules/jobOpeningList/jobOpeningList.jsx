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
          <div className="container">
            {heading?.text && (
              <div className="heading mb-3">
                <Heading {...heading} />
              </div>
            )}
            <label htmlFor="job-search-input">Search</label>
            <input
              id="job-search-input"
              type={"text"}
              ref={searchInputRef}
              onChange={(e) => {
                filterByKeyword(e.target.value);
              }}
            />
            <label htmlFor="job-location-dropdown">Filter by location</label>
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
            {jobs.length > 0 ? (
              <table className={style.jobOpenings}>
                <thead>
                  <tr>
                    <th
                      tabIndex={0}
                      title="Sort jobs by title"
                      onClick={sortJobsByTitle}
                    >
                      Job title
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
                        <td>
                          <AgilityLink
                            agilityLink={{ href: `/jobs/${job.id}` }}
                            ariaLabel={`Navigate to job opening page: ${job.title} (${job.location.name})`}
                          >
                            {job.title}
                          </AgilityLink>
                        </td>
                        <td>{job.location.name}</td>
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
