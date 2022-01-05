import Heading from "../heading";
import style from "./tableWithHeading.module.scss";

const TableWithHeading = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  return (
    <section>
      <div className="container d-flex flex-direction-column align-items-center">
        {heading.text && <Heading {...heading} />}
        {fields.tableCells && (
          <table id={style.table}>
            <tbody>
              <tr>
                <th>{fields.leftColumnLabel}</th>
                <th>{fields.rightColumnLabel}</th>
              </tr>
              {fields.tableCells.map((cell, index) => {
                return (
                  <tr key={cell.index}>
                    <td>{cell.fields.leftColumnValue}</td>
                    <td>{cell.fields.rightColumnValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default TableWithHeading;
