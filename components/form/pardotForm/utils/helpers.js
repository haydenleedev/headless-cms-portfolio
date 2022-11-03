import { getCookie, setCookie } from "../../../../utils/cookies";
import { generateUUID } from "../../../../utils/generic";
import { getUrlParamValue } from "../../../../utils/getUrlParamValue";
import fallBackPardotFormData from "../../../../data/fallbackPardotFormData.json";
import formConfig from "../form.config";

const userIdCookie = getCookie("ga_user_id");

const {
  partialHiddenFields,
  hiddenFields,
  gaMeta,
  errorMessages,
  countries,
  crmSolutions,
  employees,
  states,
  preferredMasterAgent,
  partnerAreaOfInterest,
  certificationType,
  dealRegistrationUtmDefaults,
  contactUsFieldOrder,
  dealRegistrationFieldOrder,
  landingPageFieldOrder,
  channelRequestFieldOrder,
  webinarFieldOrder,
  blogSubscriptionFieldOrder,
  partnerRequestFieldOrder,
  googleContactFieldOrder,
  defaultFieldOrder,
} = formConfig;

// This function could be split into smaller parts and/or renamed (it does more than just add GA data)
export const addGaData = ({
  gaDataAdded,
  handleSetGaDataAdded,
  formEmailInput,
  isDealRegistrationForm,
  formType,
  contactTypeValue,
}) => {
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
      formType == "contactUs" && contactTypeValue == "contact_sales";
    const isRequestDemoForm =
      formType == "contactUs" && contactTypeValue == "request_a_demo";

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
    let utmDealRegistrationDefaultResult;
    function getDealRegistrationUtmDefaultValue(url) {
      dealRegistrationUtmDefaults.map((item) => {
        if (url.includes("/deal-registration/" + item.slug)) {
          utmDealRegistrationDefaultResult = item.utmDefault;
        }
      });
      return utmDealRegistrationDefaultResult;
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
    handleSetGaDataAdded(true);
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
    case 3898:
      return "partnerCertification";
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
  if (phoneNumber.length < 7) return false;
  for (let i = 0; i < phoneNumber.length; i++) {
    const char = phoneNumber[i];
    if (!char.match(/[0-9]/) && ![" ", "+", "-", "(", ")"].includes(char)) {
      return false;
    }
  }
  return true;
};

export const isHiddenField = (field, isDealRegistrationField = false) => {
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
      fieldOrder = contactUsFieldOrder;
      break;
    case "dealRegistration":
      fieldOrder = dealRegistrationFieldOrder;
      break;
    case "landingPage":
      fieldOrder = landingPageFieldOrder;
      break;
    case "channelRequest":
      fieldOrder = channelRequestFieldOrder;
      break;
    case "webinar":
      fieldOrder = webinarFieldOrder;
      break;
    case "blogSubscription":
      fieldOrder = blogSubscriptionFieldOrder;
      break;
    case "partnerRequest":
      fieldOrder = partnerRequestFieldOrder;
      break;
    case "googleContact":
      fieldOrder = googleContactFieldOrder;
      break;
    default:
      fieldOrder = defaultFieldOrder;
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

export const stripQueryStringAndHashFromPath = (url) => {
  return url.split("?")[0].split("#")[0];
};

export const getErrorMessage = (fieldName) => {
  let errorMessage = "Please enter a valid value";
  errorMessages.forEach((item) => {
    if (item.field == fieldName) {
      errorMessage = item.message;
    }
  });
  return errorMessage;
};

export function formatPhoneNumber(value) {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}

// This function could be renamed and/or split into smaller parts
// Currently it not only checks whether the field is a select field, but also adds the options to the field
export function isSelectField(field) {
  const selectFields = [
    { regex: /(^country|^company hq country)/, options: countries },
    { regex: /(^state|^company hq state)/, options: states },
    { regex: /employees/, options: employees },
    { regex: /current crm solution/, options: crmSolutions },
    { regex: /preferred master agent/, options: preferredMasterAgent },
    { regex: /partner area of interest/, options: partnerAreaOfInterest },
    { regex: /certification type/, options: certificationType },
  ];
  for (let i = 0; i < selectFields.length; i++) {
    if (selectFields[i].regex.test(String(field.name).toLocaleLowerCase())) {
      field.options = selectFields[i].options;
      return true;
    }
  }
  return false;
}

// Partner company country and partner company state field need to be select type for other forms except for deal registration form
// This function could be renamed and/or split into smaller parts
// Currently it not only checks whether the field is a select field, but also adds the options to the field
export function isAdditionalSelectField(field) {
  const selectFields = [
    {
      regex: /(^partner company country|^partner country)/,
      options: countries,
    },
    { regex: /^partner company state/, options: states },
  ];
  for (let i = 0; i < selectFields.length; i++) {
    if (
      selectFields[i].regex.test(String(field.name).toLocaleLowerCase()) &&
      !isDealRegistrationField
    ) {
      field.options = selectFields[i].options;
      return true;
    }
  }
  return false;
}
