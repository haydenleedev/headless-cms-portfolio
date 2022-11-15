import { renderHTML } from "@agility/nextjs";
import dynamic from "next/dynamic";
import { boolean } from "../../../utils/validation";
import style from "./logosList.module.scss";
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });
const Heading = dynamic(() => import("../heading"), { ssr: false });
const Media = dynamic(() => import("../media"), { ssr: false });

const LogosListContent = ({ fields, sanitizedHtml }) => {
  const heading = JSON.parse(fields.heading);
  const grayFilter = boolean(fields?.grayFilter);
  const columnsLayout = boolean(fields?.columnsLayout);
  const logosLeft = boolean(fields?.logosLeft);
  return (
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
  );
};

export default LogosListContent;
