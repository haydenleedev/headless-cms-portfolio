import dynamic from "next/dynamic";
const ResourceListContent = dynamic(() => import("./resourceListContent"), {
  ssr: false,
});
import style from "./resourceList.module.scss";

const ResourceList = ({ module, customData }) => {
  const { fields } = module;
  const { mappedResourceListCategory } = customData;

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
      <ResourceListContent
        fields={fields}
        mappedResourceListCategory={mappedResourceListCategory}
      />
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
