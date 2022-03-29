import Heading from "../heading";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import AgilityLink from "../../agilityLink";
import { useState } from "react";
import style from "./glossaryPageContent.module.scss";

const GlossaryPageContent = ({ customData }) => {
  const { allGlossaries, sanitizedHtml } = customData;

  const alphabetsMapped = allGlossaries.map((obj) => obj.fields.alphabet);

  alphabetsMapped?.sort(function (a, b) {
    return a - b;
  });

  const alphabbetChecker = [];

  const [isActive, setActive] = useState(null);

  const clickHandler = (index = 1) => {};

  //const { fields } = module;
  return (
    <section className={`section`}>
      <div className={`container`}>
        <h1 className={style["glossary-title"]}>
          Glossary of Contact Center Terms
        </h1>
        {console.log(alphabetsMapped)}
        <nav className={style["alpha-tag-nav"]}>
          <ul className={style["alpha-tags"]}>
            {alphabetsMapped
              .filter(
                (glossary, index) => alphabetsMapped.indexOf(glossary) === index
              )
              .map((glossary, index) => (
                <li key={glossary}>
                  <a
                    href={"#" + glossary}
                    className={`${isActive === index && style.selected}`}
                    key={index}
                    onClick={() => setActive(index)}
                  >
                    {glossary.toUpperCase()}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
        <div className={style.display}>
          {allGlossaries
            .sort(function (a, b) {
              if (a.fields.word < b.fields.word) {
                return -1;
              }
              if (a.fields.word > b.fields.word) {
                return 1;
              }
              return 0;
            })
            .map((glossary, index) => (
              <div key={glossary.contentID}>
                {alphabbetChecker.indexOf(glossary.fields.alphabet) < 0 && (
                  <h2 id={glossary.fields.alphabet} className={style["css-0"]}>
                    <a
                      href={"#" + glossary.fields.alphabet}
                      className={style["glossary-anchor"]}
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        height="16"
                        version="1.1"
                        viewBox="0 0 16 16"
                        width="16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
                        ></path>
                      </svg>
                    </a>
                    {glossary.fields.alphabet.toUpperCase()}
                  </h2>
                )}
                {
                  (alphabbetChecker.push(glossary.fields.alphabet),
                  console.log("alphabetChecker: ", alphabbetChecker))
                }
                <h3
                  id={glossary.fields.word}
                  className={`${style["css-0"]} ${style["word-anchor"]}`}
                >
                  <a
                    href={"#" + glossary.fields.word}
                    aria-label="ast permalink"
                    className={style["glossary-anchor"]}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      height="16"
                      version="1.1"
                      viewBox="0 0 16 16"
                      width="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
                      ></path>
                    </svg>
                  </a>
                  {glossary.fields.word}
                </h3>
                {glossary.fields.description && (
                  <div
                    className={style.contentWrapper}
                    dangerouslySetInnerHTML={renderHTML(
                      glossary.fields.description
                    )}
                  ></div>
                )}
              </div>
            ))}
        </div>
        <p></p>
      </div>
    </section>
  );
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
