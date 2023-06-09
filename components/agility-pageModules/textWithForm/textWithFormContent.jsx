import dynamic from "next/dynamic";
import style from "./textWithForm.module.scss";
import { boolean } from "../../../utils/validation";
import { renderHTML } from "@agility/nextjs";
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";
import { getUrlParamValue } from "../../../utils/getUrlParamValue";
import { useMutationObserver } from "../../../utils/hooks";
import { resolveFormSubmitButtonText } from "../../../utils/generic";
import { useRouter } from "next/router";
const Media = dynamic(() => import("../media"));
const StarRating = dynamic(() => import("../../starRating/starRating"));
const Heading = dynamic(() => import("../heading"));
const PardotForm = dynamic(() => import("../../form/pardotForm"));
const FirstFoldLink = dynamic(() => import("./firstFoldLink"));

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
          (visibleFields[row + 1]?.children?.[1]?.tagName === "INPUT" ||
            visibleFields[row - 1]?.children?.[1]?.tagName === "INPUT");

        if (lastInputField) {
          const previousIsHalfWidthInput =
            visibleFields[row]?.previousSibling?.children?.[1]?.tagName ===
              "INPUT" &&
            visibleFields[row]?.previousSibling?.style["grid-column"] ===
              "unset" &&
            (row - 1) % 2 === 0;
          if (previousIsHalfWidthInput) {
            visibleFields[row].style["grid-column"] = "unset";
          } else visibleFields[row].style["grid-column"] = "1 / -1";
        } else if (anyInputFieldButNotLast) {
          visibleFields[row].style["grid-column"] = "unset";
        } else {
          visibleFields[row].style["grid-column"] = "1 / -1";
        }
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

  const setUtmCampaignValue = () => {
    if (utmCampaignValue) {
      return utmCampaignValue;
    } else {
      return fields?.uTMCampaignAsset ? fields?.uTMCampaignAsset : null;
    }
  };

  const setClpValue = () => {
    if (clpValue) {
      return clpValue;
    } else {
      return fields.currentLeadProgram2 ? fields.currentLeadProgram2 : null;
    }
  };

  // Set up default formStepEnabled value for resource landing pages
  const { asPath } = useRouter();
  let formStepEnabledDefaultValue;
  if (asPath.includes("/resources/") || asPath.includes("/integrations/")) {
    formStepEnabledDefaultValue = !fields.formStepsEnabled
      ? true
      : boolean(fields.formStepsEnabled);
  } else {
    formStepEnabledDefaultValue = boolean(fields.formStepsEnabled);
  }

  const formCompletionDefaultRedirectValue = fields.completionRedirectURL?.href
    ? fields.completionRedirectURL?.href
    : null;

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
              submit={resolveFormSubmitButtonText(fields, "Request a Demo")}
              stepsEnabled={formStepEnabledDefaultValue}
              contactType={
                fields.contactType ? fields.contactType : "request_a_demo"
              }
              utmCampaign={
                typeof window !== "undefined"
                  ? setUtmCampaignValue(window.location.href)
                  : null
              }
              utmAsset={
                fields.uTMCampaignAsset ? fields?.uTMCampaignAsset : null
              }
              clpField={
                typeof window !== "undefined"
                  ? setClpValue(window.location.href)
                  : null
              }
              clsField={fields.currentLeadSource2}
              stepsCompletionRedirectURL={
                formStepEnabledDefaultValue &&
                formCompletionDefaultRedirectValue
              }
              emailStepButtonText={fields?.emailStepButtonText}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TextWithFormContent;
