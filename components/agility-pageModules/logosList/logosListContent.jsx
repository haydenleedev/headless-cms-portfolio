import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { boolean } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import Media from "../media";
import style from "./logosList.module.scss";

const LogosListContent = ({ fields, customData }) => {
  const { sanitizedHtml } = customData;
  const heading = JSON.parse(fields.heading);
  const grayFilter = boolean(fields?.grayFilter);
  const columnsLayout = boolean(fields?.columnsLayout);
  const logosLeft = boolean(fields?.logosLeft);

  fields.items?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.logosList}
      ${
        fields?.borders === "borders-between"
          ? style.borders
          : fields?.borders === "borders-between-padding"
          ? style.bordersPadding
          : ""
      }
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <div className="container padding-unset">
        {heading.text && (
          <div className={style.heading}>
            <Heading {...heading} />
          </div>
        )}
        <div className={style.content}>
          <div
            className={`${columnsLayout ? style.columnsLayout : ""} ${
              logosLeft ? "flex-direction-row-reverse" : "flex-direction-row"
            }`}
          >
            {fields.text && (
              <div
                className={`content ${style.textContent}`}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              ></div>
            )}
            <div
              className={`grid-columns ${style.list} ${
                fields.link ? "mr-4" : ""
              }`}
            >
              {fields?.items?.map((logo) => (
                <div
                  className={`grid-column ${
                    fields.columns ? `is-${fields.columns}` : ""
                  } ${style.logo} ${grayFilter ? "filter-gray" : ""}`}
                  key={logo.contentID}
                >
                  {(logo.fields.link && (
                    <AgilityLink agilityLink={logo.fields.link}>
                      <Media media={logo.fields.logo} />
                    </AgilityLink>
                  )) || <Media media={logo.fields.logo} />}
                </div>
              ))}
            </div>
          </div>
          {fields.link && (
            <AgilityLink
              agilityLink={fields.link}
              className={`button white ${style.link}`}
              ariaLabel={`Navigate to page ` + fields.link.href}
              title={`Navigate to page ` + fields.link.href}
            >
              {fields.link.text}
            </AgilityLink>
          )}
        </div>
      </div>
    </section>
  );
};

export default LogosListContent;
