import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { generateUUID } from "../../utils/generic";
import { getCookie, setCookie } from "../../utils/cookies";
import { marketoScriptReadyEvent } from "../../utils/dataLayer";

const FormWrapper = ({
  handleSetFormLoaded,
  formID,
  channelEmail,
  children,
}) => {

  // do this to allow the marketo form ID being input in format "mktoForm_1638" or just "1638"
  const splitID = formID?.split("_");
  const marketoFormID = formID ? parseInt(splitID[splitID.length - 1]) : null;
  // Have to use Ref instead of state since we trigger it inside an event listener
  const gaDataAdded = useRef(false);
  const [mutated, setMutated] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const userIdCookie = getCookie("ga_user_id");

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

  // Appends meta data to head, which tag manager reads with script...
  // Also adds data to corresponding hidden form inputs
  function addGaData(seed) {
    if (gaDataAdded.current) return;
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
    gaDataAdded.current = true;
  }

  function setFormInputValue(inputName, value) {
    document.getElementsByName(inputName).forEach((element) => {
      if (element.nodeName === "INPUT") {
        element.value = value;
      }
    });
  }

  useEffect(() => {
    // check if script has already been loaded => load form
    if (window.MktoForms2 && marketoFormID) {
      const data = window.MktoForms2.loadForm(
        "//info.ujet.co",
        process.env.NEXT_PUBLIC_MARKETO_ID,
        marketoFormID
      );
      data.whenReady(handleSetFormLoaded);
    }

    var observer = new MutationObserver(function (mutations) {
      if (!mutated) {
        mutations[0].target.removeAttribute("class");
        mutations[0].target.removeAttribute("style");
        let emailInput =
          mutations[0].target.elements[channelEmail ? "channelEmail" : "Email"];

        emailInput?.addEventListener?.("input", (evt) => {
          addGaData(evt.data);
          // Update email meta & hidden input every time the field value changes
          if (!document.getElementById("ga-em-id")) {
            const head = document.getElementsByTagName("head")[0];
            var meta = document.createElement("meta");
            meta.name = "ga_em_id__c";
            meta.id = "ga-em-id";
            head.appendChild(meta);
          }
          const emailMeta = document.getElementById("ga-em-id");
          const formattedEmailValue = document
            .getElementById("Email")
            .value.replace("@", "TrQ")
            .replace(".", "OPt");
          emailMeta.content = formattedEmailValue;
          setFormInputValue(emailMeta.name, formattedEmailValue);
        });

        setMutated(true);
      }
    });

    if (marketoFormID) {
      var form = document.getElementById(`mktoForm_${marketoFormID}`);
      if (form)
        observer.observe(form, {
          attributes: true,
        });
    }
    return () => {
      document
        .querySelectorAll(".mktoForm")
        .forEach((element) => element.remove());
      document
        .querySelectorAll("#mktoStyleLoaded")
        .forEach((element) => element.remove());
    };
  }, []);

  const onScriptLoad = () => {
    return new Promise((resolve) => {
      if (marketoFormID && !formLoading) {
        setFormLoading(true);
        const data = window.MktoForms2.loadForm(
          "//info.ujet.co",
          process.env.NEXT_PUBLIC_MARKETO_ID,
          marketoFormID
        );
        data.whenReady(resolve);
      } else resolve();
    });
  };
  return (
    <>
      <Script
        id="marketo-js"
        src="//info.ujet.co/js/forms2/js/forms2.min.js"
        strategy="lazyOnload"
        onLoad={() =>
          onScriptLoad().then(() => {
            if (handleSetFormLoaded) handleSetFormLoaded();
            marketoScriptReadyEvent({});
          })
        }
      />
      {children}
    </>
  );
};

export default FormWrapper;
