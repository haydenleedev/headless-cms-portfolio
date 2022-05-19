import { useState, useEffect, useRef } from "react";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import style from "./jobOpeningList.module.scss";

const JobOpeningList = ({ module, customData }) => {
  const { fields } = module;
  const { jobListData } = customData;
  const heading = fields?.heading ? JSON.parse(fields.heading) : null;
  const searchInputRef = useRef();

  const [jobs, setJobs] = useState(jobListData);
  const [locations, setLocations] = useState([]);
  const [locationFilter, setLocationFilter] = useState(null);
  const [currentSortProperty, setCurrentSortProperty] = useState("title");
  const [titleSortDisabled, setTitleSortDisabled] = useState(false);
  const [locationSortDisabled, setLocationSortDisabled] = useState(false);
  const [employmentTypeSortDisabled, setEmploymentTypeSortDisabled] =
    useState(false);

  const sortJobs = (jobsToSort) => {
    const jobsCopy = [...jobsToSort];
    jobsCopy.sort((a, b) => {
      return a[currentSortProperty].localeCompare(b[currentSortProperty]);
    });
    return jobsCopy;
  };

  const filterByKeyword = (keyword) => {
    let jobsCopy = [...jobListData];
    const searchTerm = keyword.toLowerCase();
    const jobsFilteredByKeyword = jobsCopy.filter(
      (job) =>
        (!searchTerm && !locationFilter) ||
        (job.title.toLowerCase().includes(searchTerm) &&
          (!locationFilter || job.location == locationFilter))
    );
    let sortedFilteredJobs = sortJobs(jobsFilteredByKeyword);
    setJobs(sortedFilteredJobs);
  };

  const filterByLocation = (selectedLocation) => {
    setLocationFilter(selectedLocation);
  };

  const handleSetCurrentSortProperty = (newSortProperty) => {
    if (newSortProperty !== currentSortProperty) {
      setCurrentSortProperty(newSortProperty);
    } else {
      const jobsCopy = [...jobs];
      setJobs(jobsCopy.reverse());
    }
  };

  const countPropertyValues = (jobArray, property) => {
    const jobPropertyValues = [];
    jobArray.forEach((job) => {
      if (!jobPropertyValues.includes(job[property])) {
        jobPropertyValues.push(job[property]);
      }
    });
    return jobPropertyValues.length;
  };

  useEffect(() => {
    const allLocations = [];
    jobListData.forEach((job) => {
      if (!allLocations.includes(job.location)) {
        allLocations.push(job.location);
      }
    });
    setLocations(allLocations);
    setJobs(sortJobs(jobs));
  }, []);

  useEffect(() => {
    setTitleSortDisabled(countPropertyValues(jobs, "title") < 2);
    setLocationSortDisabled(countPropertyValues(jobs, "location") < 2);
    setEmploymentTypeSortDisabled(
      countPropertyValues(jobs, "employmentType") < 2
    );
  }, [jobs]);

  useEffect(() => {
    filterByKeyword(searchInputRef.current.value);
  }, [locationFilter]);

  useEffect(() => {
    setJobs(sortJobs(jobs));
  }, [currentSortProperty]);

  return (
    <>
      {jobListData.length > 0 && (
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

                <form role="search" className={style.formGrid}>
                  <input
                    id="job-search-input"
                    type={"text"}
                    ref={searchInputRef}
                  />
                  <button
                    aria-label="Search"
                    className={style.search}
                    onClick={(e) => {
                      e.preventDefault();
                      filterByKeyword(searchInputRef.current.value);
                    }}
                  >
                    <span className={style.magnifyingGlass}></span>
                  </button>
                </form>
              </div>
              <div className={`${style.filters} grid-column is-2`}>
                <label htmlFor="job-location-dropdown">
                  Filter by location
                </label>
                <select
                  id="job-location-dropdown"
                  onChange={(e) => {
                    filterByLocation(e.target.value);
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
                    <th>
                      <div className={style.headerContentWrapper}>
                        <p>Job Title</p>
                        <button
                          title="Sort jobs by title"
                          aria-label="Sort jobs by title"
                          aria-disabled={titleSortDisabled}
                          tabIndex={titleSortDisabled ? -1 : 0}
                          onClick={() => {
                            if (!titleSortDisabled) {
                              handleSetCurrentSortProperty("title");
                            }
                          }}
                        >
                          Sort
                        </button>
                      </div>
                    </th>
                    <th>
                      <div className={style.headerContentWrapper}>
                        <p>Employment Type</p>
                        <button
                          title="Sort jobs by employment type"
                          aria-label="Sort jobs by employment type"
                          aria-disabled={employmentTypeSortDisabled}
                          tabIndex={employmentTypeSortDisabled ? -1 : 0}
                          onClick={() => {
                            if (!employmentTypeSortDisabled) {
                              handleSetCurrentSortProperty("employmentType");
                            }
                          }}
                        >
                          Sort
                        </button>
                      </div>
                    </th>
                    <th>
                      <div className={style.headerContentWrapper}>
                        <p>Location</p>
                        <button
                          title="Sort jobs by location"
                          aria-label="Sort jobs by location"
                          aria-disabled={locationSortDisabled}
                          tabIndex={locationSortDisabled ? -1 : 0}
                          onClick={() => {
                            if (!locationSortDisabled) {
                              handleSetCurrentSortProperty("location");
                            }
                          }}
                        >
                          Sort
                        </button>
                      </div>
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
                            ariaLabel={`Navigate to job opening page: ${
                              job.title
                            } (${
                              job.location
                            }, employment type: ${job.employmentType.toLowerCase()})`}
                          >
                            {job.title}
                          </AgilityLink>
                        </td>
                        <td data-head="Employment Type">
                          {job.employmentType}
                        </td>
                        <td data-head="Location">{job.location}</td>
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
