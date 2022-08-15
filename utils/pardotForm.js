import { getCookie, setCookie } from "./cookies";
import { generateUUID } from "./generic";
import fallBackPardotFormData from "../data/fallbackPardotFormData.json";

const gaMeta = [
  {
    name: "ga_user_id__c",
    id: "ga-user-id",
  },
  {
    name: "ga_user_each_id__c",
    id: "ga-user-each-id",
  },
  {
    name: "ga_cookie_id__c",
    id: "ga-cookie-id",
  },
];
const userIdCookie = getCookie("ga_user_id");

export const addGaData = (
  gaDataAdded,
  updateGaDataAdded,
  formEmailInput,
  isDealRegistrationForm,
  formType
) => {
  if (!gaDataAdded) {
    // Loop and append randomized UID
    const UUID = generateUUID();
    const head = document.getElementsByTagName("head")[0];
    let gaCookieIdCValue;
    gaMeta.map((item, index) => {
      var meta = document.createElement("meta");
      meta.name = item.name;
      meta.content = UUID + index;
      meta.id = item.id;
      if (meta.name === "ga_user_id__c") {
        if (!userIdCookie) {
          gaCookieIdCValue = meta.content;
          setCookie(
            "ga_user_id",
            meta.content,
            "Fri, 31 Dec 9999 23:59:59 GMT"
          );
        }
        setFormInputValue("ga_user_id", meta.content);
      } else if (meta.name === "ga_cookie_id__c") {
        if (userIdCookie) {
          setFormInputValue("ga_cookie_id", userIdCookie);
          meta.content = userIdCookie;
        } else {
          setFormInputValue("ga_cookie_id", gaCookieIdCValue);
          meta.content = gaCookieIdCValue;
        }
      } else {
        setFormInputValue("ga_cookie_id", meta.content);
      }
      head.appendChild(meta);
    });

    // Page url
    var meta = document.createElement("meta");
    meta.name = "ga_page";
    meta.content = window.location.href;
    meta.id = "ga-page-url";
    head.appendChild(meta);
    setFormInputValue(meta.name, meta.content);

    // Date
    let date = new Date().toUTCString();
    var meta = document.createElement("meta");
    meta.name = "ga_date__c";
    meta.content = date;
    meta.id = "ga-date";
    head.appendChild(meta);
    setFormInputValue("ga_date", meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_cookie_date__c";
    meta.content = getCookie("ga_cookie_date");
    meta.id = "ga-cookie-date";
    head.appendChild(meta);
    setFormInputValue("ga_cookie_date", meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_datetime__c";
    meta.content = date;
    meta.id = "ga-datetime";
    head.appendChild(meta);
    setFormInputValue("ga_datetime", meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_cookie_datetime__c";
    meta.content = getCookie("ga_cookie_date");
    meta.id = "ga-cookie-datetime";
    head.appendChild(meta);
    setFormInputValue("ga_cookie_datetime", meta.content);

    // Get Asset Type for all forms for Resources pages
    let getAssetUrl = window.location.href.split("?")[0];
    let setAssetType;
    const resourceTypesByPaths = [
      { path: "/resources/ebooks/", type: "eBook" },
      { path: "/resources/reports/", type: "Report" },
      { path: "/resources/guides/", type: "Guide" },
      { path: "/resources/white-papers/", type: "White Paper" },
      { path: "/resources/webinars/", type: "Webinar" },
      { path: "/resources/videos/", type: "Webinar" },
      { path: "/integrations/", type: "Datasheet" },
    ];

    const getAssetType = (pageUrl) => {
      resourceTypesByPaths.map((url) => {
        if (pageUrl.includes(url.path)) {
          setAssetType = url.type;
        }
      });
      return setAssetType;
    };

    // Get Asset Title for all forms for Resources pages
    if (document.querySelector("h1")) {
      const hTitle = document.querySelector("h1").innerText;
      let setAssetTitle;
      const getAssetTitle = (pageUrl) => {
        resourceTypesByPaths.map((url) => {
          if (pageUrl.includes(url.path)) {
            setAssetTitle = hTitle;
          }
        });
        return setAssetTitle;
      };

      setFormInputValue("Asset Title", getAssetTitle(window.location.href));
    }

    // Values based on URL parameters
    setFormInputValue("utm_asset", getUrlParamValue("utm_asset"));
    const utmCampaignValue = getUrlParamValue("utm_campaign");
    const isGoogleContactForm = formType == "googleContact";
    if (utmCampaignValue) {
      setFormInputValue("utm_campaign", utmCampaignValue);
    } else if (!utmCampaignValue && isGoogleContactForm) {
      setFormInputValue("utm_campaign", "gmp_contact_sales");
    }
    const utmSourceValue = getUrlParamValue("utm_source");
    if (utmSourceValue) {
      setFormInputValue("utm_source", utmSourceValue);
    } else if (!utmSourceValue && isGoogleContactForm) {
      setFormInputValue("utm_source", "google_marketplace");
    }
    setFormInputValue("utm_medium", getUrlParamValue("utm_medium"));
    setFormInputValue("utm_term", getUrlParamValue("utm_term"));

    setFormInputValue("Asset Type", getAssetType(window.location.href));
    setFormInputValue("Asset URL", getAssetUrl);

    // CLP & CLS default values
    let clpDefaultValue;
    let clsDefaultValue;
    switch (formType) {
      case "dealRegistration":
        clpDefaultValue = "Deal_Registration";
        clsDefaultValue = "ALLIANCES";
        break;
      case "channelRequest":
        clpDefaultValue = "Deal_Registration";
        clsDefaultValue = "CHANNEL";
        break;
      case "partnerRequest":
        clpDefaultValue = "Request to Partner";
        clsDefaultValue = "CHANNEL";
        break;
      case "googleContact":
        clpDefaultValue = "Partner_Program";
        clsDefaultValue = "ALLIANCES";
        break;
    }
    if (clpDefaultValue) {
      setFormInputValue("Current Lead Program 2", clpDefaultValue, false);
    } else {
      setFormInputValue(
        "Current Lead Program 2",
        getUrlParamValue("clp", "Website"),
        false
      );
    }
    if (clsDefaultValue) {
      setFormInputValue("Current Lead Source 2", clsDefaultValue, false);
    } else {
      setFormInputValue("Current Lead Source 2", "MKTG", false);
    }

    // Flag done so we don't run it again
    updateGaDataAdded(true);
  }
  // Update email meta & hidden input every time the field value changes
  if (!document.getElementById("ga-em-id")) {
    const head = document.getElementsByTagName("head")[0];
    var meta = document.createElement("meta");
    meta.name = "ga_em_id__c";
    meta.id = "ga-em-id";
    head.appendChild(meta);
  }
  const emailMeta = document.getElementById("ga-em-id");
  const formattedEmailValue = formEmailInput.value
    .replace("@", "TrQ")
    .replace(".", "OPt");
  emailMeta.content = formattedEmailValue;
  setFormInputValue("ga_em_id", formattedEmailValue);

  function setFormInputValue(inputName, value, replace = true) {
    document.getElementsByName(inputName).forEach((element) => {
      if (
        element.nodeName === "INPUT" &&
        (replace || (!replace && !element.value))
      ) {
        element.value = value;
      }
    });
  }
  function getUrlParamValue(paramName, defaultValue = "") {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const urlParamValue = urlParams.get(paramName);
    return urlParamValue || defaultValue;
  }
};

export const getFormStep = (formType) => {
  let currentStep = 1;
  if (typeof document !== "undefined") {
    document.cookie.split(/; */).forEach((cookie) => {
      const cookieName = cookie.split("=")[0];
      if (cookieName.includes(`${formType}Submit`)) {
        const step = cookieName.split(`${formType}Submit`)[1];
        if (step >= currentStep) {
          currentStep = parseInt(step) + 1;
        }
      }
    });
  }
  return currentStep;
};

export const getFallbackFieldData = (formID) => {
  const fields = [];
  fallBackPardotFormData.forEach((field) => {
    if (field.formHandlerId == formID) {
      fields.push(field);
    }
  });
  return fields;
};

export const isNonUsPhoneNumber = (phoneNumber) => {
  for (let i = 0; i < phoneNumber.length; i++) {
    const char = phoneNumber[i];
    if (!char.match(/[0-9]/) && ![" ", "+", "-", "(", ")"].includes(char)) {
      return false;
    }
  }
  return true;
};

export const getCampaignScript = (customPICid) => {
  if (typeof document !== "undefined") {
    const scriptTag = document.createElement("script");
    scriptTag.id = "campaignScript";
    scriptTag.innerHTML = `
      piAId = '987641';
      piCId = '${customPICid || 59465}';
      piHostname = 'pi.pardot.com';

      (function() {
        function async_load(){
          var s = document.createElement('script'); s.type = 'text/javascript';
          s.src = ('https:' == document.location.protocol ? 'https://pi' : 'http://cdn') + '.pardot.com/pd.js';
          var c = document.getElementsByTagName('script')[0]; c.parentNode.insertBefore(s, c);
        }
        if(window.attachEvent) { window.attachEvent('onload', async_load); }
        else { window.addEventListener('load', async_load, false); }
      })();
  `;
    return scriptTag;
  }
};

export const reorderFieldData = (fieldData, formType) => {
  let fieldOrder;
  switch (formType) {
    case "contactUs":
      fieldOrder = [
        /first name/,
        /last name/,
        /email/,
        /job/,
        /company/,
        /# of agents/,
        /country/,
        /state/,
        /phone/,
      ];
      break;
    case "dealRegistration":
      fieldOrder = [
        /first name/,
        /last name/,
        /job/,
        /^email/,
        /^company name/,
        /employees/,
        /country/,
        /state/,
        /^phone/,
      ];
      break;
    case "landingPage":
      fieldOrder = [
        /first name/,
        /last name/,
        /email/,
        /job/,
        /company/,
        /# of agents/,
        /country/,
        /state/,
        /phone/,
      ];
      break;
    case "channelRequest":
      fieldOrder = [
        /first name/,
        /last name/,
        /job/,
        /^company name/,
        /^email/,
        /company hq country/,
        /company hq state/,
        /company hq city/,
        /^phone/,
        /employees/,
        /channel pain point/,
        /current crm solution/,
        /current contact center solution software/,
        /# of licenses/,
        /additional details/,
        /partner company name/,
        /partner full name/,
        /partner title/,
        /partner email/,
        /partner country/,
        /partner company state/,
        /partner company city/,
        /partner phone/,
        /preferred master agent/,
        /promo code/,
      ];
      break;
    case "webinar":
      fieldOrder = [
        /first name/,
        /last name/,
        /email/,

        /job/,
        /company/,
        /# of agents/,
        /country/,
        /state/,
        /phone/,
      ];
      break;
    case "blogSubscription":
      fieldOrder = [/email/, /country/];
      break;
    case "partnerRequest":
      fieldOrder = [
        /first name/,
        /last name/,
        /job/,
        /partner area of interest/,
        /company/,
        /email/,

        /country/,
        /state/,
        /phone/,
      ];
      break;
    case "googleContact":
      fieldOrder = [
        /first name/,
        /last name/,
        /email/,
        /job/,
        /company/,
        /# of agents/,

        /country/,
        /state/,
        /city/,
        /phone/,
      ];
      break;
    default:
      fieldOrder = [
        /first name/,
        /last name/,
        /email/,

        /country/,
        /state/,
        /phone/,
      ];
  }
  const orderedFieldData = [];
  fieldOrder.forEach((fieldRegex) => {
    fieldData.forEach((field) => {
      if (fieldRegex.test(field.name.toLowerCase())) {
        orderedFieldData.push(field);
      }
    });
  });
  fieldData.forEach((field) => {
    if (!orderedFieldData.includes(field)) {
      orderedFieldData.push(field);
    }
  });
  return orderedFieldData;
};
