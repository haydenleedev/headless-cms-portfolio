import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
import style from "./tableWithHeading.module.scss";

const TableWithHeading = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  fields.tableCells?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`
      ${fields?.backgroundColor ? fields?.backgroundColor : ""}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue}
    `}
    >
      <div className="container d-flex flex-direction-column align-items-center">
        {heading.text && <Heading {...heading} />}
        {fields.tableCells && (
          <table id={style.table}>
            <tbody>
              <tr>
                {fields.leftRowHeading && <th>{fields.leftRowHeading}</th>}

                <th>{fields.leftColumnLabel}</th>
                <th>{fields.rightColumnLabel}</th>
              </tr>
              {fields.tableCells.map((cell, index) => {
                return (
                  <tr key={`cell${index}`}>
                    {cell.fields.leftRowHeadingValue && (
                      <td>{cell.fields.leftRowHeadingValue}</td>
                    )}

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
