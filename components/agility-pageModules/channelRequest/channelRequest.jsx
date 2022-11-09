import { renderHTML } from "@agility/nextjs";
import style from "./channelRequest.module.scss";
import {
  convertUJETLinksToHttps,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import dynamic from "next/dynamic";
const PardotForm = dynamic(() => import("../../form/pardotForm"), {
  ssr: false,
});

const ChannelRequest = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml, formConfiguration } = customData;
  const channel = dynamicPageItem.fields;
  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");

  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: channel.title,
            image: channel?.image?.url,
            keywords: dynamicPageItem.properties.referenceName,
            wordcount: articleText?.split(" ").length,
            url: channel.oGUrl,
            datePublished: channel.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: channel.date,
            description: channel.metaDescription,
            articleBody: articleText,
          }),
        ]}
      />

      <section className="section">
        <div className="container">
          <div className={style.columns}>
            <div className={style.content}>
              <h1 className="heading-6">{channel.title}</h1>
              <div
                className="content mt-4"
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              />
            </div>
            <div className={`${channel.formBackgroundColor} ${style.form}`}>
              {/\S/.test(channel.formTitle) && (
                <h2 className={`${style.formTitle} heading-6`}>
                  {channel.formTitle || "Partner Information"}
                </h2>
              )}
              <PardotForm
                formHandlerID={
                  channel.pardotFormID ? channel.pardotFormID : "3709"
                }
                config={formConfiguration}
                action={
                  channel.formAction
                    ? channel.formAction
                    : "https://info.ujet.cx/l/986641/2022-08-04/kffw5"
                }
                submit={channel.formSubmitText}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

ChannelRequest.getCustomInitialProps = async function ({
  dynamicPageItem,
  agility,
  languageCode,
}) {
  const api = agility;

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const formConfiguration = await api.getContentList({
    referenceName: "formconfiguration",
    expandAllContentLinks: true,
    languageCode,
  });

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = dynamicPageItem.fields.text
    ? convertUJETLinksToHttps(cleanHtml(dynamicPageItem.fields.text))
    : null;

  return {
    sanitizedHtml,
    formConfiguration,
  };
};

export default ChannelRequest;
