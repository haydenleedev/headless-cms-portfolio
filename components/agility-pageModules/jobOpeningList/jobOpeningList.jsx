import { useState, useEffect, useRef } from "react";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import style from "./jobOpeningList.module.scss";

const JobOpeningList = ({ module, customData }) => {
  const { fields } = module;
  const { jobListData } = customData;
  const heading = fields?.heading ? JSON.parse(fields.heading) : null;
  const searchInputRef = useRef();
  const maxListingsPerPage = 20;
  const splitJobsIntoPages = () => {
    const jobsCopy = [...jobs];
    while (jobsCopy.length) {
      jobsCopy.splice(0, maxListingsPerPage);
    }
    return jobsCopy;
  };

  const [jobs, setJobs] = useState(jobListData);
  const [locations, setLocations] = useState([]);
  const [locationFilter, setLocationFilter] = useState(null);
  const [currentSortProperty, setCurrentSortProperty] = useState("title");
  const [titleSortDisabled, setTitleSortDisabled] = useState(false);
  const [locationSortDisabled, setLocationSortDisabled] = useState(false);
  const [employmentTypeSortDisabled, setEmploymentTypeSortDisabled] =
    useState(false);
  const [isActiveSorting, setIsActiveSorting] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(splitJobsIntoPages());

  const handleBtn = (btnId) => (e) => {
    //e.preventDefault();
    setIsActiveSorting((state) => ({
      ...state,
      [btnId]: !state[btnId],
    }));
  };

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
      const pagesCopy = [...pages];
      pagesCopy.forEach((page, index) => {
        pagesCopy[index] = pagesCopy[index].reverse();
      });
      setPages(pagesCopy);
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

  const updateSortDisabledStatuses = () => {
    if (pages[currentPage]) {
      setTitleSortDisabled(
        countPropertyValues(pages[currentPage], "title") < 2
      );
      setLocationSortDisabled(
        countPropertyValues(pages[currentPage], "location") < 2
      );
      setEmploymentTypeSortDisabled(
        countPropertyValues(pages[currentPage], "employmentType") < 2
      );
    }
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
    const newPages = [];
    let lastNonFullPageIndex = 0;
    for (let i = 0; i < jobs.length; i++) {
      if (!newPages[lastNonFullPageIndex]) {
        newPages.push([]);
      }
      if (newPages[lastNonFullPageIndex].length < maxListingsPerPage) {
        newPages[lastNonFullPageIndex].push(jobs[i]);
        if (newPages[lastNonFullPageIndex].length == maxListingsPerPage) {
          lastNonFullPageIndex += 1;
        }
      }
    }
    setPages(newPages);
    setCurrentPage(0);
  }, [jobs]);

  useEffect(() => {
    updateSortDisabledStatuses();
  }, [pages]);

  useEffect(() => {
    updateSortDisabledStatuses();
  }, [currentPage]);

  useEffect(() => {
    filterByKeyword(searchInputRef.current.value);
  }, [locationFilter]);

  useEffect(() => {
    const pagesCopy = [...pages];
    pagesCopy.forEach((page, index) => {
      pagesCopy[index] = sortJobs(pagesCopy[index]);
    });
    setPages(pagesCopy);
  }, [currentSortProperty]);

  return (
    <>
      {jobListData.length > 0 && (
        <section
          className={`section ${style.jobOpeningList} ${
            fields?.backgroundColor ? fields?.backgroundColor : ""
          }`}
        >
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
                <div className={style.locationDropdownWrapper}>
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
              </div>
            </fieldset>
          </div>
          <div className="container mt-3">
            <h2 className={`heading-4 pb-3 mt-5`}>Search Results</h2>
            {jobs.length > 0 ? (
              <table className={style.jobOpenings}>
                <thead className={`bg-navy text-white`}>
                  <tr>
                    <th>
                      <div className={style.headerContentWrapper}>
                        <p>Job Title</p>
                        <button
                          className={`${style.sort}`}
                          title="Sort jobs by title"
                          aria-label="Sort jobs by title"
                          aria-disabled={titleSortDisabled}
                          tabIndex={titleSortDisabled ? -1 : 0}
                          onClick={() => {
                            if (!titleSortDisabled) {
                              handleBtn("btn1")();
                              handleSetCurrentSortProperty("title");
                            }
                          }}
                        >
                          <span
                            className={`${
                              isActiveSorting["btn1"] && style.asc
                            }`}
                          ></span>
                        </button>
                      </div>
                    </th>
                    <th>
                      <div className={style.headerContentWrapper}>
                        <p>Employment Type</p>
                        <button
                          className={style.sort}
                          title="Sort jobs by employment type"
                          aria-label="Sort jobs by employment type"
                          aria-disabled={employmentTypeSortDisabled}
                          tabIndex={employmentTypeSortDisabled ? -1 : 0}
                          onClick={() => {
                            if (!employmentTypeSortDisabled) {
                              handleBtn("btn2")();
                              handleSetCurrentSortProperty("employmentType");
                            }
                          }}
                        >
                          <span
                            className={`${
                              isActiveSorting["btn2"] ? style.asc : ""
                            }`}
                          ></span>
                        </button>
                      </div>
                    </th>
                    <th>
                      <div className={style.headerContentWrapper}>
                        <p>Location</p>
                        <button
                          className={style.sort}
                          title="Sort jobs by location"
                          aria-label="Sort jobs by location"
                          aria-disabled={locationSortDisabled}
                          tabIndex={locationSortDisabled ? -1 : 0}
                          onClick={() => {
                            if (!locationSortDisabled) {
                              handleBtn("btn3")();
                              handleSetCurrentSortProperty("location");
                            }
                          }}
                        >
                          <span
                            className={`${
                              isActiveSorting["btn3"] ? style.asc : ""
                            }`}
                          ></span>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages[currentPage]?.map((job, index) => {
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
            {pages.length > 0 && (
              <div className={style.pagination}>
                <div className={style.pageButtons}>
                  <button
                    className={`reset-button ${style.previousPageButton}`}
                    disabled={!currentPage > 0}
                    tabIndex={currentPage > 0 ? "0" : "-1"}
                    onClick={() => {
                      if (currentPage > 0) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                  />
                  {pages.length < 8 ? (
                    <>
                      {pages.map((page, index) => {
                        return (
                          <button
                            key={`pageButton${index}`}
                            className={`reset-button ${style.pageButton} ${
                              index == currentPage ? "w-600" : ""
                            }`}
                            onClick={() => {
                              setCurrentPage(index);
                            }}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <button
                        className={`reset-button ${style.pageButton} ${
                          currentPage == 0 ? "w-600" : ""
                        }`}
                        onClick={() => {
                          setCurrentPage(0);
                        }}
                      >
                        1
                      </button>
                      {currentPage < 4 && (
                        <>
                          {pages.map((page, index) => {
                            if (index != 0 && index < 4) {
                              return (
                                <button
                                  key={`pageButton${index}`}
                                  className={`reset-button ${
                                    style.pageButton
                                  } ${index == currentPage ? "w-600" : ""}`}
                                  onClick={() => {
                                    setCurrentPage(index);
                                  }}
                                >
                                  {index + 1}
                                </button>
                              );
                            }
                          })}
                          ...
                        </>
                      )}
                      {currentPage > 3 && currentPage < pages.length - 3 && (
                        <>
                          ...
                          {pages.map((page, index) => {
                            if (
                              index >= currentPage - 1 &&
                              index < currentPage + 2
                            )
                              return (
                                <button
                                  key={`pageButton${index}`}
                                  className={`reset-button ${
                                    style.pageButton
                                  } ${index == currentPage ? "w-600" : ""}`}
                                  onClick={() => {
                                    setCurrentPage(index);
                                  }}
                                >
                                  {index + 1}
                                </button>
                              );
                          })}
                          ...
                        </>
                      )}
                      {currentPage > pages.length - 4 && (
                        <>
                          ...
                          {pages.map((page, index) => {
                            if (
                              index > pages.length - 4 &&
                              index < pages.length - 1
                            )
                              return (
                                <button
                                  key={`pageButton${index}`}
                                  className={`reset-button ${
                                    style.pageButton
                                  } ${index == currentPage ? "w-600" : ""}`}
                                  onClick={() => {
                                    setCurrentPage(index);
                                  }}
                                >
                                  {index + 1}
                                </button>
                              );
                          })}
                        </>
                      )}
                      <button
                        className={`reset-button ${style.pageButton} ${
                          currentPage == pages.length - 1 ? "w-600" : ""
                        }`}
                        onClick={() => {
                          setCurrentPage(pages.length - 1);
                        }}
                      >
                        {pages.length}
                      </button>
                    </>
                  )}
                  {/* {pages.map((page, index) => {
                    return (
                      <button
                        key={`pageButton${index}`}
                        className={`reset-button ${style.pageButton} ${
                          index == currentPage ? "w-600" : ""
                        }`}
                        onClick={() => {
                          setCurrentPage(index);
                        }}
                      >
                        {index + 1}
                      </button>
                    );
                  })} */}
                  <button
                    className={`reset-button ${style.nextPageButton}`}
                    disabled={currentPage == pages.length - 1}
                    tabIndex={currentPage < pages.length - 1 ? "0" : "-1"}
                    onClick={() => {
                      if (currentPage < pages.length - 1) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                  />
                </div>
                <p>
                  Showing {currentPage + 1} of {pages.length}
                </p>
              </div>
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
