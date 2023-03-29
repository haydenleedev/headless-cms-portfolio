import dynamic from "next/dynamic";
import { cn } from "../../../utils/generic";
import style from "./flexColumnTableWithHeading.module.scss";
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
      heading,
    },
  },
}) => {
  // Margins & Paddings
  const mtValue = marginTop ? marginTop : "";
  const mbValue = marginBottom ? marginBottom : "";
  const ptValue = paddingTop ? paddingTop : "";
  const pbValue = paddingBottom ? paddingBottom : "";

  const sectionHeading = heading ? JSON.parse(heading) : null;

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
          {tableColumns?.length > 0 && (
            <div
              className={style.table}
              style={{
                gridTemplateColumns: `repeat(${tableColumns.length}, minmax(0, 1fr))`,
              }}
            >
              {tableColumns.map((column, i) => (
                <table className={style.tableColumn} key={i}>
                  <tr className={style.columnTitle}>
                    <th>{column.fields.columnTitle}</th>
                  </tr>
                  {column.fields.cells.map((cell, j) => (
                    <tr key={j} className={style.columnCell}>
                      <td>{cell.fields.value}</td>
                    </tr>
                  ))}
                </table>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlexColumnTableWithHeading;
