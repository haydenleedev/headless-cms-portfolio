import dynamic from "next/dynamic";

const ArchivesPageContentBlock = dynamic(() =>
  import("./archivesPageContentBlock")
);

const ArchivesPageContent = ({ module, customData }) => {
  const { fields } = module;
  const { archivesPageData } = customData;
  return (
    <ArchivesPageContentBlock
      fields={fields}
      archivesPageData={archivesPageData}
    />
  );
};

ArchivesPageContent.getCustomInitialProps = async function ({ agility }) {
  const api = agility;
  const sortContentListByDate = (list) => {
    const sorted = list.sort((a, b) => {
      if (Date.parse(a.fields.date) > Date.parse(b.fields.date)) return -1;
      if (Date.parse(a.fields.date) < Date.parse(b.fields.date)) return 1;

      return 0;
    });
    return sorted;
  };

  const getArchivesPageContent = async () => {
    let contentListTypes = [
      {
        title: "News",
        id: "news",
        content: [],
        categories: null,
      },
      {
        title: "Press Releases",
        id: "pressreleases",
        content: [],
        categories: null,
      },
      {
        title: "Resources",
        id: "resources",
        content: [],
        categories: {
          casestudy: { title: "Case Study", content: [] },
          ebooks: { title: "e-Books", content: [] },
          guides: { title: "Guides", content: [] },
          integrations: { title: "Product Datasheets", content: [] },
          partnercontent: { title: "Partner Content", content: [] },
          reports: { title: "Reports", content: [] },
          videos: { title: "Videos", content: [] },
          webinars: { title: "Webinars", content: [] },
          whitepapers: { title: "White Papers", content: [] },
        },
      },
    ];

    async function getContentList(referenceName) {
      const languageCode = "en-us";
      // get total count of  to determine how many calls we need to get all pages
      let initial = await api.getContentList({
        referenceName,
        languageCode,
        take: 1,
      });

      let totalCount = initial.totalCount;
      let skip = 0;
      let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
        () => {
          let pagePromise = api.getContentList({
            referenceName,
            languageCode,
            take: 50, // 50 is max value for take parameter
            skip,
          });
          skip += 50;
          return pagePromise;
        }
      );
      promisedPages = await Promise.all(promisedPages);
      let contentList = [];
      promisedPages.map((result) => {
        contentList = [...contentList, ...result.items];
      });
      return contentList;
    }

    // get news
    const news = await getContentList("newsArticle");
    contentListTypes[0].content = [...contentListTypes[0].content, ...news];

    // get press releases
    const pressReleases = await getContentList("pressReleaseArticle");
    contentListTypes[1].content = [
      ...contentListTypes[1].content,
      ...pressReleases,
    ];

    // get resources: ebooks, guides, integrations, reports, webinars, white papers

    const casestudy = await getContentList("casestudy");
    const ebooks = await getContentList("ebooks");
    const guides = await getContentList("guides");
    const integrations = await getContentList("integrations");
    const reports = await getContentList("reports");
    const webinars = await getContentList("webinars");
    const videos = await getContentList("videos");
    const whitepapers = await getContentList("whitepapers");
    const partnercontent = await getContentList("partnercontent");

    // set same static images for entries in webinars & videos
    const staticWebinarCardImageUrls = [
      "https://assets.ujet.cx/CCC-Solutions-Website-Tile.png?q=75&w=480&format=auto",
      "https://assets.ujet.cx/Webinar-May-27-V2_website-webinar-tile.png?q=75&w=480&format=auto",
      "https://assets.ujet.cx/Webinar-June24_website-webinar-tile.png?q=75&w=480&format=auto",
    ];

    webinars.map((entry, index) => {
      const indexRemainder = index % staticWebinarCardImageUrls.length;
      const imageIndex =
        indexRemainder > 0
          ? indexRemainder - 1
          : staticWebinarCardImageUrls.length - 1;
      if (entry.fields.image) {
        entry.fields.image.url = staticWebinarCardImageUrls[imageIndex];
      } else {
        entry.fields["image"] = {
          label: null,
          url: staticWebinarCardImageUrls[imageIndex],
          target: null,
          filesize: 118727,
          pixelHeight: "450",
          pixelWidth: "794",
          height: 450,
          width: 794,
        };
      }
    });

    videos.map((entry, index) => {
      const indexRemainder = index % staticWebinarCardImageUrls.length;
      const imageIndex =
        indexRemainder > 0
          ? indexRemainder - 1
          : staticWebinarCardImageUrls.length - 1;
      if (entry.fields.image) {
        entry.fields.image.url = staticWebinarCardImageUrls[imageIndex];
      } else {
        entry.fields["image"] = {
          label: null,
          url: staticWebinarCardImageUrls[imageIndex],
          target: null,
          filesize: 118727,
          pixelHeight: "450",
          pixelWidth: "794",
          height: 450,
          width: 794,
        };
      }
    });

    contentListTypes[2].content = sortContentListByDate([
      ...ebooks,
      ...guides,
      ...integrations,
      ...reports,
      ...videos,
      ...webinars,
      ...whitepapers,
    ]);

    contentListTypes[2].categories.casestudy.content = [...casestudy];
    contentListTypes[2].categories.ebooks.content = [...ebooks];
    contentListTypes[2].categories.guides.content = [...guides];
    contentListTypes[2].categories.integrations.content = [...integrations];
    contentListTypes[2].categories.reports.content = [...reports];
    contentListTypes[2].categories.videos.content = [...videos];
    contentListTypes[2].categories.webinars.content = [...webinars];
    contentListTypes[2].categories.whitepapers.content = [...whitepapers];
    contentListTypes[2].categories.partnercontent.content = [...partnercontent];

    // Make press releases the first content list type
    const pressReleaseType = contentListTypes[1];
    contentListTypes.splice(1, 1);
    contentListTypes.splice(0, 0, pressReleaseType);

    return contentListTypes;
  };
  const archivesPageData = await getArchivesPageContent();
  return { archivesPageData };
};

export default ArchivesPageContent;
