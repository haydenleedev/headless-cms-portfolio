import dynamic from "next/dynamic";
import style from "./textWithForm.module.scss";
import { boolean } from "../../../utils/validation";
import { renderHTML } from "@agility/nextjs";
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";
import { getUrlParamValue } from "../../../utils/getUrlParamValue";
import { useMutationObserver } from "../../../utils/hooks";
const Media = dynamic(() => import("../media"), { ssr: true });
const StarRating = dynamic(() => import("../../starRating/starRating"), {
  ssr: false,
});
const Heading = dynamic(() => import("../heading"), { ssr: true });
const PardotForm = dynamic(() => import("../../form/pardotForm"), {
  ssr: false,
});
const FirstFoldLink = dynamic(() => import("./firstFoldLink"), { ssr: true });

const TextWithFormContent = ({
  fields,
  sanitizedHtml,
  featuredAwards,
  formConfiguration,
}) => {
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
        "form > div:not(.display-none)"
      );
      for (let row = 0; row < visibleFields.length; row++) {
        if (
          row === visibleFields.length - 2 &&
          Array.from(visibleFields[row].children).length >= 2 &&
          visibleFields[row].children[1].tagName === "INPUT"
        ) {
          visibleFields[row].style["grid-column"] = "1 / -1";
        } else if (
          row < visibleFields.length - 2 &&
          Array.from(visibleFields[row].children).length >= 2 &&
          visibleFields[row].children[1].tagName === "INPUT"
        )
          visibleFields[row].style["grid-column"] = "unset";
        else visibleFields[row].style["grid-column"] = "1 / -1";
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

  // Set clp value from the url if the value exist.  If there's no parameters, then get the default values from "fields.currentLeadProgram2".
  const clpValue = getUrlParamValue("clp");

  const setUtmCampaignValue = (url) => {
    if (utmCampaignValue) {
      return utmCampaignValue;
    } else {
      return fields.uTMCampaignAsset ? fields.uTMCampaignAsset : null;
    }
  };
  const setUtmAssetValue = () => {
    if (fields.uTMCampaignAsset) {
      return fields.uTMCampaignAsset;
    } else {
      return null;
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

  useEffect(() => {
    campaignScriptIDRef.current = fields.campaignTrackingID;
  }, []);

  return (
    <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
      <div
        className={`${fields.textAlignment ? fields.textAlignment : ""}
          ${
            columnLayout
              ? `${style.columnLayoutContent}`
              : `${style.content} ${style[fields.layout]}`
          }`}
      >
        {(heading || subheading) && (
          <aside className={`${style.columnLayoutHeading}`}>
            {heading && <Heading {...heading} />}
            {subheading && <Heading {...subheading} />}
          </aside>
        )}
        <aside className={`${style.textContent}`}>
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
            <FirstFoldLink fields={fields} primary />
            <FirstFoldLink fields={fields} />
          </div>

          {fields.testimonials && (
            <div className={`columns repeat-2 ${style.testimonials}`}>
              {fields.testimonials.map((testimonial) => (
                <div key={testimonial.contentID} className={style.testimonial}>
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
              formHandlerID={fields.pardotFormID ? fields.pardotFormID : "3568"}
              config={formConfiguration}
              action={
                fields.formAction
                  ? fields.formAction
                  : "https://info.ujet.cx/l/986641/2022-06-29/k12n5"
              }
              submit={
                fields.formSubmitText ? fields.formSubmitText : "Request a Demo"
              }
              stepsEnabled={fields.formStepsEnabled}
              contactType={
                fields.contactType ? fields.contactType : "request_a_demo"
              }
              utmCampaign={
                typeof window !== "undefined" &&
                setUtmCampaignValue(window.location.href)
              }
              utmAsset={typeof window !== "undefined" && setUtmAssetValue()}
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
  );
};

export default TextWithFormContent;
