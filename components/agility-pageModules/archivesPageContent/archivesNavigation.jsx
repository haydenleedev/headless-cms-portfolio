import style from "./archivesPageContent.module.scss";

const ArchivesNavigation = ({
  totalPagesCount,
  activePageNumber,
  perPage,
  previousPage,
  nextPage,
  handleSetActivePageNumber,
  handleSetCurrentOffset,
}) => {
  return (
    <footer className={style.pagination}>
      <div className="d-flex">
        <button
          className={`reset-button ${style.previousPageButton}`}
          onClick={previousPage}
          disabled={activePageNumber === 0}
        ></button>
        {totalPagesCount && (
          <>
            {totalPagesCount < 8 ? (
              [...Array(totalPagesCount).keys()].map((pageNumber) => (
                <div
                  key={`pageButton${pageNumber}`}
                  className={pageNumber === activePageNumber ? "w-600" : ""}
                >
                  <button
                    className={`reset-button ${style.pageButton}`}
                    onClick={() => {
                      handleSetCurrentOffset(pageNumber * perPage);
                      handleSetActivePageNumber(pageNumber);
                    }}
                    key={pageNumber}
                  >
                    {pageNumber + 1}
                  </button>
                </div>
              ))
            ) : (
              <>
                <div className={activePageNumber === 0 ? "w-600" : ""}>
                  <button
                    className={`reset-button ${style.pageButton}`}
                    onClick={() => {
                      handleSetCurrentOffset(0);
                      handleSetActivePageNumber(0);
                    }}
                    key={1}
                  >
                    1
                  </button>
                </div>
                {activePageNumber < 4 && (
                  <>
                    {[...Array(totalPagesCount).keys()]
                      .slice(1, 4)
                      .map((pageNumber) => (
                        <div
                          key={`pageButton${pageNumber}`}
                          className={
                            pageNumber === activePageNumber ? "w-600" : ""
                          }
                        >
                          <button
                            className={`reset-button ${style.pageButton}`}
                            onClick={() => {
                              handleSetCurrentOffset(pageNumber * perPage);
                              handleSetActivePageNumber(pageNumber);
                            }}
                            key={pageNumber}
                          >
                            {pageNumber + 1}
                          </button>
                        </div>
                      ))}
                    ...
                  </>
                )}
                {activePageNumber > 3 &&
                  activePageNumber < totalPagesCount - 3 && (
                    <>
                      ...
                      {[...Array(totalPagesCount).keys()]
                        .slice(activePageNumber - 1, activePageNumber + 2)
                        .map((pageNumber) => (
                          <div
                            key={`pageButton${pageNumber}`}
                            className={
                              pageNumber === activePageNumber ? "w-600" : ""
                            }
                          >
                            <button
                              className={`reset-button ${style.pageButton}`}
                              onClick={() => {
                                handleSetCurrentOffset(pageNumber * perPage);
                                handleSetActivePageNumber(pageNumber);
                              }}
                              key={pageNumber}
                            >
                              {pageNumber + 1}
                            </button>
                          </div>
                        ))}
                      ...
                    </>
                  )}
                {activePageNumber > totalPagesCount - 4 && (
                  <>
                    ...
                    {[...Array(totalPagesCount).keys()]
                      .slice(totalPagesCount - 4, totalPagesCount - 1)
                      .map((pageNumber) => (
                        <div
                          key={`pageButton${pageNumber}`}
                          className={
                            pageNumber === activePageNumber ? "w-600" : ""
                          }
                        >
                          <button
                            className={`reset-button ${style.pageButton}`}
                            onClick={() => {
                              handleSetCurrentOffset(pageNumber * perPage);
                              handleSetActivePageNumber(pageNumber);
                            }}
                            key={pageNumber}
                          >
                            {pageNumber + 1}
                          </button>
                        </div>
                      ))}
                  </>
                )}
                <div
                  className={
                    activePageNumber === totalPagesCount - 1 ? "w-600" : ""
                  }
                >
                  <button
                    className={`reset-button ${style.pageButton}`}
                    onClick={() => {
                      handleSetCurrentOffset(totalPagesCount - 1 * perPage);
                      handleSetActivePageNumber(totalPagesCount - 1);
                    }}
                    key={totalPagesCount - 1}
                  >
                    {totalPagesCount}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        <button
          className={`reset-button ${style.nextPageButton}`}
          onClick={nextPage}
          disabled={activePageNumber + 1 === totalPagesCount}
        ></button>
      </div>
      <p>
        Showing {activePageNumber + 1} of {totalPagesCount}
      </p>
    </footer>
  );
};

export default ArchivesNavigation;
