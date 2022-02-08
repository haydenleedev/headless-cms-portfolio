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
  const gaDataAdded = useRef(false);
  const [mutated, setMutated] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
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
  // Also adds data to corresponding hidden form inputs
  function addGaData(seed) {
    if (gaDataAdded.current) return;
    // Loop and append randomized UID
    const UUID = generateUUID();
    const head = document.getElementsByTagName("head")[0];
    gaMeta.map((item, index) => {
      var meta = document.createElement("meta");
      meta.name = item.name;
      meta.content = UUID + index;
      meta.id = item.id;
      head.appendChild(meta);
      addFormInputData(document.getElementsByName(meta.name), meta.content);
    });

    // Page url
    var meta = document.createElement("meta");
    meta.name = "ga_page";
    meta.content = window.location.href;
    meta.id = "ga-page-url";
    head.appendChild(meta);
    addFormInputData(document.getElementsByName(meta.name), meta.content);

    // Date
    var meta = document.createElement("meta");
    meta.name = "ga_date__c";
    meta.content = new Date().toUTCString();
    meta.id = "ga-date";
    head.appendChild(meta);
    addFormInputData(document.getElementsByName(meta.name), meta.content);

    var meta = document.createElement("meta");
    meta.name = "ga_cookie_date__c";
    meta.content = getCookie("ga_cookie_date");
    meta.id = "ga-cookie-date";
    head.appendChild(meta);
    addFormInputData(document.getElementsByName(meta.name), meta.content);

    // Flag done so we don't run it again
    gaDataAdded.current = true;

    function addFormInputData(nodeList, value) {
      nodeList.forEach((element) => {
        if (element.nodeName === "INPUT") {
          element.value = value;
        }
      });
    }
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
          addGaData(evt.data);
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
          })
        }
      />
      {children}
    </>
  );
};

export default FormWrapper;
