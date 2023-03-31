import dynamic from "next/dynamic";
import { cn } from "../../../utils/generic";
import style from "./flexColumnTableWithHeading.module.scss";
import { boolean } from "../../../utils/validation";
import { useEffect, useState } from "react";
import variables from "../../../styles/settings/variables.module.scss";
import { remToPixels } from "../../../utils/convert";
const Heading = dynamic(() =>
  import("../../../components/agility-pageModules/heading")
);

const FlexColumnTableWithHeading = ({
  module: {
    fields: {
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
      backgroundColor,
      tableRowsColorScheme,
      tableColumns,
      tableRows,
      heading,
    },
  },
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Margins & Paddings
  const mtValue = marginTop ? marginTop : "";
  const mbValue = marginBottom ? marginBottom : "";
  const ptValue = paddingTop ? paddingTop : "";
  const pbValue = paddingBottom ? paddingBottom : "";

  const sectionHeading = heading ? JSON.parse(heading) : null;

  const headingRow = tableRows?.find((row) => boolean(row.fields.isHeadingRow));
  const rowTableColumnCount = headingRow.fields.cells.length;

  const longestColumn = tableColumns?.reduce((prev, current) =>
    prev.fields.cells.length > current.fields.cells.length ? prev : current
  ).fields.cells.length;

  const checkMobile = () => {
    if (window.innerWidth < remToPixels(variables.largeDesktop))
      setIsMobile(true);
    else setIsMobile(false);
  };
  useEffect(() => {
    checkMobile();
    window?.addEventListener("resize", checkMobile);
    return () => {
      window?.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section
      className={cn({
        section: true,
        [style.flexColumnTableWithHeading]: true,
        [backgroundColor]: backgroundColor,
        [mtValue]: true,
        [mbValue]: true,
        [ptValue]: true,
        [pbValue]: true,
      })}
    >
      <div className={`container ${style.content}`}>
        <div className={cn([style.tableWrapper, style[tableRowsColorScheme]])}>
          <div className={style.headingWrapper}>
            <Heading {...sectionHeading} />
          </div>
          {tableRows?.length > 0 ? (
            <table className={style.rowTable}>
              {tableRows
                .sort((prev, current) => {
                  if (
                    boolean(prev.isHeadingRow) &&
                    !boolean(current.isHeadingRow)
                  )
                    return 1;
                  else if (
                    !boolean(prev.isHeadingRow) &&
                    boolean(current.isHeadingRow)
                  )
                    return -1;
                  return 0;
                })
                .map((row, i) =>
                  row.fields.isHeadingRow ? (
                    <tr
                      key={i}
                      className={`${style.columnTitle} ${
                        isMobile ? "is-hidden" : ""
                      }`}
                      style={{
                        gridTemplateColumns: `repeat(${rowTableColumnCount}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.fields.cells
                        .slice(0, rowTableColumnCount)
                        .map((cell, j) => (
                          <th key={j}>{cell.fields.value}</th>
                        ))}
                    </tr>
                  ) : (
                    <tr
                      key={i}
                      className={style.columnCell}
                      style={{
                        gridTemplateColumns: `repeat(${rowTableColumnCount}, minmax(0, 1fr))`,
                      }}
                    >
                      {isMobile
                        ? row.fields.cells
                            .slice(0, rowTableColumnCount)
                            .map((cell, j) => (
                              <td key={j}>
                                <b>
                                  {headingRow.fields.cells[j].fields.value}:
                                </b>{" "}
                                {cell.fields.value}
                              </td>
                            ))
                        : row.fields.cells
                            .slice(0, rowTableColumnCount)
                            .map((cell, j) => (
                              <td key={j}>{cell.fields.value}</td>
                            ))}
                    </tr>
                  )
                )}
            </table>
          ) : (
            <>
              {tableColumns?.length > 0 && (
                <div
                  className={style.columnTable}
                  style={{
                    gridTemplateColumns: `repeat(${tableColumns.length}, minmax(0, 1fr))`,
                  }}
                >
                  {tableColumns.map((column, i) => (
                    <table className={style.tableColumn} key={i}>
                      <thead>
                        <tr className={style.columnTitle}>
                          <th>{column.fields.columnTitle}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array(longestColumn)
                          .fill(0)
                          .map((key, j) => (
                            <tr key={j} className={style.columnCell}>
                              <td>{column.fields.cells[j]?.fields?.value}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlexColumnTableWithHeading;
