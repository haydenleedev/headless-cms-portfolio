import { getCookie, setCookie } from "./cookies";
import { generateUUID } from "./generic";
import { getUrlParamValue } from "./getUrlParamValue";
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

// This function could be split into smaller parts and/or renamed (it does more than just add GA data)
export const addGaData = (
  gaDataAdded,
  updateGaDataAdded,
  formEmailInput,
  // isDealRegistrationForm could be moved to variable inside this function by checking the value of the formType prop
  isDealRegistrationForm,
  formType,
  contactTypeValue
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

    // Values based on URL parameters
    const utmCampaignValue = getUrlParamValue("utm_campaign");
    const isGoogleContactForm = formType == "googleContact";
    const isChannelRequestForm = formType == "channelRequest";

    const isContactSalesForm =
      formType == "contactUs" && contactTypeValue == "contactSales";
    const isRequestDemoForm =
      formType == "contactUs" && contactTypeValue == "requestDemo";

    let contactType;
    // If there is no future use for this currently unused function, it should be removed
    function getContactFormType() {
      if (document.querySelector("input[name=contact_type]")) {
        const getContactType = document.querySelector(
          "input[name=contact_type]"
        );
        if (getContactType.value === "contact_sales") {
          contactType = "contactSales";
        } else if (getContactType.value === "request_a_demo") {
          contactType = "requestDemo";
        }
        return contactType;
      }
    }

    // Get the default utm_campaign and utm_asset values for all Deal Registration pages when there are no utm parameters on urls.
    const utmDefault = [
      { slug: "google", utmDefault: "deal_reg_google_mp" },
      { slug: "kustomer", utmDefault: "deal_reg_google_kustomer" },
      { slug: "playvox", utmDefault: "deal_reg_google_playvox" },
      { slug: "acqueon", utmDefault: "deal_reg_google_acqueon" },
      { slug: "aws", utmDefault: "deal_reg_google_aws" },
      { slug: "calabrio", utmDefault: "deal_reg_google_calabrio" },
      { slug: "intercom", utmDefault: "deal_reg_google_intercom" },
      { slug: "observe-ai", utmDefault: "deal_reg_google_observe" },
      { slug: "oracle", utmDefault: "deal_reg_google_oracle" },
      { slug: "successkpi", utmDefault: "deal_reg_google_successKPI" },
      { slug: "zendesk", utmDefault: "deal_reg_google_zendesk" },
    ];

    let utmDealRegistrationDefalutResult;
    function getDealRegistrationUtmDefaultValue(url) {
      utmDefault.map((item) => {
        if (url.includes("/deal-registration/" + item.slug)) {
          utmDealRegistrationDefalutResult = item.utmDefault;
        }
      });
      return utmDealRegistrationDefalutResult;
    }

    // Set the default utm_campaign values if statement in this part has the condition !utmCampaignValue
    if (utmCampaignValue) {
      setFormInputValue("utm_campaign", utmCampaignValue);
    } else if (!utmCampaignValue && isGoogleContactForm) {
      setFormInputValue("utm_campaign", "gmp_contact_sales");
    } else if (!utmCampaignValue && isChannelRequestForm) {
      setFormInputValue("utm_campaign", "request_to_partner");
    } else if (!utmCampaignValue && isContactSalesForm) {
      setFormInputValue("utm_campaign", "contact_sales");
    } else if (!utmCampaignValue && isRequestDemoForm) {
      setFormInputValue("utm_campaign", "request_demo");
    } else if (!utmCampaignValue && isDealRegistrationForm) {
      setFormInputValue(
        "utm_campaign",
        getDealRegistrationUtmDefaultValue(window.location.href)
      );
    }
    // This part could be easier to read in this format:
    // if (utmCampaignValue) {
    //   setFormInputValue("utm_campaign", utmCampaignValue);
    // } else {
    //   if (isGoogleContactForm) {
    //     setFormInputValue("utm_campaign", "gmp_contact_sales");
    //   } else if (isChannelRequestForm) {
    //     setFormInputValue("utm_campaign", "request_to_partner");
    //   } else if (isContactSalesForm) {
    //     setFormInputValue("utm_campaign", "contact_sales");
    //   } else if (isRequestDemoForm) {
    //     setFormInputValue("utm_campaign", "request_demo");
    //   } else if (isDealRegistrationForm) {
    //     setFormInputValue(
    //       "utm_campaign",
    //       getDealRegistrationUtmDefaultValue(window.location.href)
    //     );
    //   }
    // }

    // Set the default utm_asset values if the parameter value doesn't exist in the url.
    const utmAssetValue = getUrlParamValue("utm_asset");
    if (utmAssetValue) {
      setFormInputValue("utm_asset", utmAssetValue);
    } else if (!utmAssetValue && isGoogleContactForm) {
      setFormInputValue("utm_asset", "gmp_contact_sales");
    } else if (!utmAssetValue && isChannelRequestForm) {
      setFormInputValue("utm_asset", "request_to_partner");
    } else if (!utmCampaignValue && isContactSalesForm) {
      setFormInputValue("utm_asset", "contact_sales");
    } else if (!utmCampaignValue && isRequestDemoForm) {
      setFormInputValue("utm_asset", "request_demo");
    } else if (!utmAssetValue && isDealRegistrationForm) {
      setFormInputValue(
        "utm_asset",
        getDealRegistrationUtmDefaultValue(window.location.href)
      );
    }

    // Set the default utm_source values
    const utmSourceValue = getUrlParamValue("utm_source");
    if (utmSourceValue) {
      setFormInputValue("utm_source", utmSourceValue);
    } else if (!utmSourceValue && isGoogleContactForm) {
      setFormInputValue("utm_source", "google_marketplace");
    }
    setFormInputValue("utm_medium", getUrlParamValue("utm_medium"));
    setFormInputValue("utm_term", getUrlParamValue("utm_term"));

    /* setFormInputValue("Asset Type", getAssetType(window.location.href)); */
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
  /* function getUrlParamValue(paramName, defaultValue = "") {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const urlParamValue = urlParams.get(paramName);
    return urlParamValue || defaultValue;
  } */
};

export const getFormType = (formHandlerID) => {
  switch (parseInt(formHandlerID)) {
    case 3568:
      return "contactUs";
    case 3571:
      return "dealRegistration";
    case 3658:
      return "landingPage";
    case 3709:
      return "channelRequest";
    case 3712:
      return "webinar";
    case 3715:
      return "blogSubscription";
    case 3718:
      return "partnerRequest";
    case 3721:
      return "googleContact";
  }
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

export const isHiddenField = (field, isDealRegistrationField = false) => {
  // Blacklist hidden fields from Pardot form handler fields
  const hiddenFields = [
    /ga_/,
    /utm_/,
    /current lead/,
    /hidden/,
    /hide/,
    /alliance referral/,
    /asset /,
    /contact_type/,
    /lead record type/,
  ];

  const partialHiddenFields = [/partner country/, /partner company/];

  // Check whether form field is blacklisted
  if (
    partialHiddenFields.some(
      (re) =>
        re.test(String(field.name).toLocaleLowerCase()) &&
        isDealRegistrationField
    )
  ) {
    return true;
  } else if (
    hiddenFields.some((re) =>
      re.test(String(field.name).toLocaleLowerCase())
    ) ||
    String(field.name).toLocaleLowerCase() === "partner"
  ) {
    return true;
  }
  return false;
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
        /city/,
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
        /opportunity details/,
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
