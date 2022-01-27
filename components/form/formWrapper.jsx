import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { generateUUID } from "../../utils/generic";
import Head from "next/head";
import { getCookie } from "../../utils/cookies";

const FormWrapper = ({ handleSetFormLoaded, formID, children }) => {
  // do this to allow the marketo form ID being input in format "mktoForm_1638" or just "1638"
  const splitID = formID?.split("_");
  const marketoFormID = formID ? parseInt(splitID[splitID.length - 1]) : null;
  // Have to use Ref instead of state since we trigger it inside an event listener
  const metaAdded = useRef(false);
  const [mutated, setMutated] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
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
    {
      name: "ga_em_id__c",
      id: "ga-em-id",
    },
  ];

  // Appends meta data to head, which tag manager reads with script...
  function addMetaToHead(seed) {
    if (metaAdded.current) return;
    // Loop and append randomized UID
    const UUID = generateUUID();
    const head = document.getElementsByTagName("head")[0];
    gaMeta.map((item, index) => {
      var meta = document.createElement("meta");
      meta.name = item.name;
      meta.content = UUID + index;
      meta.id = item.id;
      head.appendChild(meta);
    });

    // Page url
    var meta = document.createElement("meta");
    meta.name = "ga_page";
    meta.content = window.location.href;
    meta.id = "ga-page-url";
    head.appendChild(meta);

    // Date
    var meta = document.createElement("meta");
    meta.name = "ga_date__c";
    meta.content = new Date().toUTCString();
    meta.id = "ga-date";
    head.appendChild(meta);

    // Marketo cookie date not sure where this comes from?
    var meta = document.createElement("meta");
    meta.name = "ga_cookie_date__c";
    meta.content = getCookie("mkto-gaCookieDate7");
    meta.id = "ga-cookie-date";
    head.appendChild(meta);

    // Flag done so we don't run it again
    metaAdded.current = true;
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
        var emailInput = mutations[0].target.elements["Email"];
        emailInput?.addEventListener?.("input", (evt) => {
          addMetaToHead(evt.data);
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
      if (marketoFormID) {
        if (!formLoaded) {
          const data = window.MktoForms2.loadForm(
            "//info.ujet.co",
            process.env.NEXT_PUBLIC_MARKETO_ID,
            marketoFormID
          );
          data.whenReady(resolve);
          data.whenReady(setFormLoaded(true));
        }
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
          })
        }
      />
      {children}
    </>
  );
};

export default FormWrapper;
