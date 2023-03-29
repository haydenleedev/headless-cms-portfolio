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
                <ul className={style.tableColumn} key={i}>
                  <li className={style.columnTitle}>
                    {column.fields.columnTitle}
                  </li>
                  {column.fields.cells.map((cell, j) => (
                    <li key={j} className={style.columnCell}>
                      {cell.fields.value}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlexColumnTableWithHeading;
