import { getCookie, setCookie } from "./cookies";
import { generateUUID } from "./generic";

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

export const addGaData = (gaDataAdded, updateGaDataAdded, formEmailInput) => {
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
        setFormInputValue(meta.name, meta.content);
      } else if (meta.name === "ga_cookie_id__c") {
        if (userIdCookie) {
          setFormInputValue(meta.name, userIdCookie);
          meta.content = userIdCookie;
        } else {
          setFormInputValue(meta.name, gaCookieIdCValue);
          meta.content = gaCookieIdCValue;
        }
      } else {
        setFormInputValue(meta.name, meta.content);
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
    setFormInputValue(meta.name, meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_cookie_date__c";
    meta.content = getCookie("ga_cookie_date");
    meta.id = "ga-cookie-date";
    head.appendChild(meta);
    setFormInputValue(meta.name, meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_datetime__c";
    meta.content = date;
    meta.id = "ga-datetime";
    head.appendChild(meta);
    setFormInputValue(meta.name, meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_cookie_datetime__c";
    meta.content = getCookie("ga_cookie_date");
    meta.id = "ga-cookie-datetime";
    head.appendChild(meta);
    setFormInputValue(meta.name, meta.content);
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
  setFormInputValue(emailMeta.name, formattedEmailValue);
  function setFormInputValue(inputName, value) {
    document.getElementsByName(inputName).forEach((element) => {
      if (element.nodeName === "INPUT") {
        element.value = value;
      }
    });
  }
};
