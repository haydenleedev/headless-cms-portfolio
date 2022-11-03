import style from "./textWithForm.module.scss";
import { boolean } from "../../../utils/validation";
import Media from "../media";
import StarRating from "../../starRating/starRating";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";
import PardotForm from "../../form/pardotForm/index";
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";
import { getUrlParamValue } from "../../../utils/getUrlParamValue";
import AgilityLink from "../../agilityLink";
import { useMutationObserver } from "../../../utils/hooks";

const TextWithForm = ({ module, customData }) => {
  const { sanitizedHtml, featuredAwards, formConfiguration } = customData;
  const { fields } = module;
  const { campaignScriptIDRef } = useContext(GlobalContext);
  const narrowContainer = boolean(fields?.narrowContainer);
  const columnLayout = fields.layout == "column";
  const showAwards = boolean(fields?.showAwards);
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const subheading = fields.subheading ? JSON.parse(fields.subheading) : null;
  const linksStyle = fields?.linksStyle || "button";

  const formRightCollapsedChanges = () => {
    const form = formWrapperRef?.current?.querySelector?.("form");
    if (fields.layout === "formRightCollapsed" && form) {
      const visibleFields = form.querySelectorAll(
        `form > label:not(.display-none):not(${style.removehoney})`
      );
      for (let row = 0; row < visibleFields.length; row++) {
        const lastInputField =
          row === visibleFields.length - 1 &&
          visibleFields[row].children[1].tagName === "INPUT";
        const anyInputFieldButNotLast =
          row < visibleFields.length - 1 &&
          visibleFields[row].children[1].tagName === "INPUT" &&
          visibleFields[row + 1]?.children?.[1]?.tagName === "INPUT";

        if (lastInputField) {
          const previousIsHalfWidthInput =
            visibleFields[row].previousSibling.children[1] === "INPUT" &&
            visibleFields[row].previousSibling.children[1].style[
              "grid-column"
            ] === "unset";
          if (previousIsHalfWidthInput) {
            visibleFields[row].style["grid-column"] = "1 / -1";
          } else visibleFields[row].style["grid-column"] = "unset";
        } else if (anyInputFieldButNotLast) {
          visibleFields[row].style["grid-column"] = "unset";
        } else visibleFields[row].style["grid-column"] = "1 / -1";
      }
    }
  };
  const formWrapperRef = useMutationObserver({
    options: {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    },
    callback:
      fields.layout === "formRightCollapsed"
        ? formRightCollapsedChanges
        : (mutationList, observer) => observer.disconnect(),
  });
  fields.testimonials?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  fields.featuredAwards?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // Set utm_campaign and utm_asset values from the url if the values exist.  If there's no parameters, then get the default values from "fields.uTMCampaignAsset".
  const utmCampaignValue = getUrlParamValue("utm_campaign");
  const utmAssetValue = getUrlParamValue("utm_asset");

  // Set clp value from the url if the value exist.  If there's no parameters, then get the default values from "fields.currentLeadProgram2".
  const clpValue = getUrlParamValue("clp");

  const setUtmCampaignValue = (url) => {
    if (utmCampaignValue) {
      return utmCampaignValue;
    } else {
      return fields.uTMCampaignAsset ? fields.uTMCampaignAsset : null;
    }
  };
  const setUtmAssetValue = (url) => {
    if (utmAssetValue) {
      return utmAssetValue;
    } else {
      return fields.uTMCampaignAsset ? fields.uTMCampaignAsset : null;
    }
  };
  const setClpValue = (url) => {
    if (clpValue) {
      return clpValue;
    } else {
      return fields.currentLeadProgram2 ? fields.currentLeadProgram2 : null;
    }
  };

  const getLinksStyle = () => {
    switch (linksStyle) {
      case "textWithArrow":
        return "chevron-after w-600 mt-2";
      case "buttonNavy":
        return "button navy mt-2";
      case "buttonOrange":
        return "button orange mt-2";
      default:
        return "button cyan outlined mt-2";
    }
  };

  const FirstFoldLink = ({ primary }) => {
    const link = primary ? fields.primaryLink : fields.secondaryLink;
    return link?.href && link?.text ? (
      <div className={style.linkWrapper}>
        <AgilityLink
          agilityLink={link}
          className={`${getLinksStyle()} ${
            primary ? `${style.primaryLink}` : style.secondaryLink
          } ${fields.linkClasses ? fields.linkClasses : ""} ${
            style[linksStyle]
          }`}
          ariaLabel={`Navigate to page ` + link.href}
          title={`Navigate to page ` + link.href}
        >
          {link.text}
        </AgilityLink>
      </div>
    ) : null;
  };

  useEffect(() => {
    campaignScriptIDRef.current = fields.campaignTrackingID;
  }, []);

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.textWithForm}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        <div
          className={
            columnLayout
              ? style.columnLayoutContent
              : `${style.content} ${style[fields.layout]}`
          }
        >
          {(heading || subheading) && (
            <aside className={style.columnLayoutHeading}>
              {heading && <Heading {...heading} />}
              {subheading && <Heading {...subheading} />}
            </aside>
          )}
          <aside className={style.textContent}>
            {(heading || subheading) && (
              <div className={style.rowLayoutHeading}>
                {heading && <Heading {...heading} />}
                {subheading && <Heading {...subheading} />}
              </div>
            )}
            <div
              className="content"
              dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
            ></div>

            <div className={style.buttons}>
              <FirstFoldLink primary />
              <FirstFoldLink />
            </div>

            {fields.testimonials && (
              <div className={`columns repeat-2 ${style.testimonials}`}>
                {fields.testimonials.map((testimonial) => (
                  <div
                    key={testimonial.contentID}
                    className={style.testimonial}
                  >
                    <StarRating
                      starCount={testimonial.fields?.starCount}
                      starWidth="25"
                    />
                    <p>{testimonial.fields.text}</p>
                    <small>–{testimonial.fields.name}</small>
                  </div>
                ))}
              </div>
            )}
            {showAwards && featuredAwards && (
              <div className={`grid-columns ${style.awardImages}`}>
                {featuredAwards.map((award) => (
                  <div
                    key={award.contentID}
                    className={`grid-column is-${featuredAwards.length} ${style.awardImage}`}
                  >
                    <Media media={award.fields.image} />
                  </div>
                ))}
              </div>
            )}
          </aside>
          <aside className={style.form}>
            <div
              className={`${style.sideWrapper} ${style["bg-skyblue-light"]}`}
              ref={formWrapperRef}
            >
              <PardotForm
                formHandlerID={
                  fields.pardotFormID ? fields.pardotFormID : "3568"
                }
                config={formConfiguration}
                action={
                  fields.formAction
                    ? fields.formAction
                    : "https://info.ujet.cx/l/986641/2022-06-29/k12n5"
                }
                submit={
                  fields.formSubmitText
                    ? fields.formSubmitText
                    : "Request a Demo"
                }
                stepsEnabled={fields.formStepsEnabled}
                contactType={
                  fields.contactType ? fields.contactType : "request_a_demo"
                }
                utmCampaign={
                  typeof window !== "undefined" &&
                  setUtmCampaignValue(window.location.href)
                }
                utmAsset={
                  typeof window !== "undefined" &&
                  setUtmAssetValue(window.location.href)
                }
                clpField={
                  typeof window !== "undefined" &&
                  setClpValue(window.location.href)
                }
                clsField={fields.currentLeadSource2}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

TextWithForm.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;

  // console.log("<<<<<<<< Pardot form data: ", JSON.stringify(pardotFormData));
  // TODO: parse pardot form HTML if it's possible. Might not be in case it's returned only inside the embed iFrame...

  let featuredAwards = await api.getContentList({
    referenceName: "featuredawards",
    languageCode,
    languageCode,
    sort: "properties.itemOrder",
    direction: "desc",
    expandAllContentLinks: true,
    take: 7,
  });
  featuredAwards = featuredAwards.items[0].fields.awards;

  const formConfiguration = await api.getContentList({
    referenceName: "formconfiguration",
    expandAllContentLinks: true,
    languageCode,
  });

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
    featuredAwards,
    formConfiguration,
  };
};

export default TextWithForm;
