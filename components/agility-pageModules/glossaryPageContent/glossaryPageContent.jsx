import Heading from "../heading";
import AgilityLink from "../../agilityLink";
import style from "./glossaryPageContent.module.scss";

const GlossaryPageContent = ({ module, customData }) => {
  const { allGlossaries } = customData;

  const { fields } = module;
  return (
    <section
      className={`section ${fields.classes ? fields.classes : ""}`}
      id={fields.id ? fields.id : null}
    >
      <div className={`container`}>
        <h1 className={style["glossary-title"]}>
          Glossary of Contact Center Terms
        </h1>

        <nav className={style["alpha-tag-nav"]}>
          <ul className={style["alpha-tags"]}>
            {allGlossaries &&
              allGlossaries
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((glossary) => (
                  <li key={glossary.fields.word}>
                    <a
                      href={"#" + glossary.fields.alphabet}
                      className={style.awardLink}
                    >
                      {glossary.fields.alphabet}
                    </a>
                  </li>
                ))}
          </ul>
        </nav>
        <div className={style.display}>
          {allGlossaries &&
            allGlossaries.map((glossary) => (
              <>
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
                  {glossary.fields.alphabet}
                </h2>
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
                <p>{glossary.fields.description}</p>
              </>
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
        take: 1, // 50 is max value for take parameter
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

  return { allGlossaries };
};

export default GlossaryPageContent;
