import Link from "next/link";
import { resolveLink } from "../../../utils/convert";
import GenericCard from "../../genericCard/genericCard";
import Heading from "../heading";
import style from "./resourceList.module.scss";

const ResourceList = ({ module, customData }) => {
  const { fields } = module;
  const { mappedResourceListCategory } = customData;
  const heading = JSON.parse(fields.heading);
  const resources =
    mappedResourceListCategory[fields.resourceListCategory]?.content;
  const placeholderImages = [];
  if (fields.overrideImages && fields.overrideImages.media) {
    fields.overrideImages?.media?.forEach((image) => {
      placeholderImages.push({
        url: image.url,
        pixelWidth: 3,
        pixelHeight: 2,
      });
    });
  }

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${fields.classes ? fields.classes : ""} ${
        style.resourceList
      }
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <nav className="container" aria-label="resource list">
        {heading.text && (
          <div className={`heading ${style.heading}`}>
            <Heading {...heading} />
          </div>
        )}
        <div className={style.resources}>
          {fields.highlightedResources
            ? fields.highlightedResources.map((resource, index) => (
                <div className={style.resource} key={resource.contentID}>
                  <GenericCard
                    link={resolveLink(
                      resource.properties.referenceName,
                      resource.fields
                    )}
                    category={resource.properties.referenceName}
                    overrideCategory={resource.fields.cardCategoryTitle}
                    title={resource.fields.title}
                    ariaTitle={resource.fields.title}
                    image={
                      placeholderImages?.length > index
                        ? placeholderImages[index]
                        : resource.fields.image
                    }
                  />
                </div>
              ))
            : resources?.map((resource, index) => (
                <div className={style.resource} key={resource.contentID}>
                  <GenericCard
                    link={resolveLink(
                      resource.properties.referenceName,
                      resource.fields
                    )}
                    category={resource.properties.referenceName}
                    overrideCategory={resource.fields.cardCategoryTitle}
                    title={resource.fields.title}
                    image={
                      placeholderImages?.length >= index
                        ? placeholderImages[index]
                        : resource.fields.image
                    }
                  />
                </div>
              ))}
        </div>
        {fields.resourceListCategory && (
          <div className={style.link}>
            <Link
              href={`/archives?type=resources&categories=${mappedResourceListCategory[
                fields.resourceListCategory
              ].types.map((type, i) => {
                if (
                  i <
                  mappedResourceListCategory[fields.resourceListCategory].types
                    .length -
                    1
                )
                  return `${type},`;
                return `${type}`;
              })}`
                .split(" ")
                .join("")}
            >
              <a
                className="button cyan outlined"
                aria-label="Navigate to page resource archives page"
                title="Navigate to page resource archives page"
              >
                Read More
              </a>
            </Link>
          </div>
        )}
      </nav>
    </section>
  );
};

ResourceList.getCustomInitialProps = async function ({
  agility,
  languageCode,
}) {
  const api = agility;

  // map the values from resourceListCategory field to the according list types.
  let mappedResourceListCategory = {
    guidesReports: { types: ["guides, reports"], content: [] },
    ebooksWhitepapers: { types: ["ebooks, whitepapers"], content: [] },
    productDatasheets: { types: ["integrations"], content: [] },
    partnerContent: { types: ["partnercontent"], content: [] },
    videosWebinars: { types: ["webinars"], content: [] },
  };

  async function getContentList(referenceName) {
    // take just three because we'll only list max 3 of one resource category on the resource list.
    let content = await api.getContentList({
      referenceName,
      languageCode,
      take: 3,
    });
    return content.items;
  }

  function sortContentByDate(list) {
    return list.sort((a, b) => {
      if (Date.parse(a.fields.date) > Date.parse(b.fields.date)) return -1;
      if (Date.parse(a.fields.date) < Date.parse(b.fields.date)) return 1;

      return 0;
    });
  }

  // get resources: ebooks, guides, integrations, reports, webinars, white papers
  let guides = await getContentList("guides");
  let reports = await getContentList("reports");

  let ebooks = await getContentList("ebooks");
  let whitePapers = await getContentList("whitepapers");

  let integrations = await getContentList("integrations");

  let partnerContent = await getContentList("partnercontent");

  let webinars = await getContentList("webinars");

  let guidesReportsContent = sortContentByDate([...guides, ...reports]);
  let ebooksWhitepapersContent = sortContentByDate([...ebooks, ...whitePapers]);
  let productDatasheetsContent = sortContentByDate([...integrations]);
  let videosWebinarsContent = sortContentByDate([...webinars]);
  let partnerContentContent = sortContentByDate([...partnerContent]);

  mappedResourceListCategory["guidesReports"].content =
    guidesReportsContent.slice(0, 3);

  mappedResourceListCategory["ebooksWhitepapers"].content =
    ebooksWhitepapersContent.slice(0, 3);
  mappedResourceListCategory["productDatasheets"].content =
    productDatasheetsContent.slice(0, 3);
  mappedResourceListCategory["videosWebinars"].content =
    videosWebinarsContent.slice(0, 3);
  mappedResourceListCategory["partnerContent"].content =
    partnerContentContent.slice(0, 3);

  // set same static images for entries in videosWebinars
  const staticWebinarCardImageUrls = [
    "https://assets.ujet.cx/Webinar-June24_website-webinar-tile.png?q=75&w=480&format=auto",
    "https://assets.ujet.cx/CCC-Solutions-Website-Tile.png?q=75&w=480&format=auto",
    "https://assets.ujet.cx/Webinar-May-27-V2_website-webinar-tile.png?q=75&w=480&format=auto",
  ];
  mappedResourceListCategory["videosWebinars"].content.map((entry, index) => {
    entry.fields.image.url = staticWebinarCardImageUrls[index];
  });

  return {
    mappedResourceListCategory,
  };
};

export default ResourceList;
