import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { boolean } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import Media from "../media";
import style from "./logosList.module.scss";

const LogosList = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const grayFilter = boolean(fields?.grayFilter);
  const columnsLayout = boolean(fields?.columnsLayout);
  const logosLeft = boolean(fields?.logosLeft);

  fields.items?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  return (
    <section
      className={`section ${style.logosList} ${
        fields.classes ? fields.classes : ""
      } ${fields.backgroundColor ? fields.backgroundColor : ""}`}
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

LogosList.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default LogosList;
