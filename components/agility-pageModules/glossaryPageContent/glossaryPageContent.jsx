import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const GlossaryPageContentWrap = dynamic(
  () => import("./glossaryPageContentWrap"),
  { ssr: true }
);

const GlossaryPageContent = ({ customData }) => {
  const { allGlossaries } = customData;
  return <GlossaryPageContentWrap allGlossaries={allGlossaries} />;
};

GlossaryPageContent.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;
  // get total count of  to determine how many calls we need to get all pages
  let initial = await api.getContentList({
    referenceName: "glossaryList",
    languageCode,
    take: 1,
  });

  let totalCount = initial.totalCount;
  let skip = 0;
  let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
    (call) => {
      let pagePromise = api.getContentList({
        referenceName: "glossaryList",
        languageCode,
        sort: "properties.itemOrder",
        direction: "asc",
        take: 50, // 50 is max value for take parameter
        skip,
      });
      skip += 50;
      return pagePromise;
    }
  );
  promisedPages = await Promise.all(promisedPages);
  let allGlossaries = [];
  promisedPages.map((result) => {
    allGlossaries = [...allGlossaries, ...result.items];
  });

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.description
    ? cleanHtml(item.fields.description)
    : null;

  return { allGlossaries, sanitizedHtml };
};

export default GlossaryPageContent;
