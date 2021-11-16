import { useEffect } from "react";
import Script from "next/script";

const FormWrapper = ({ handleSetFormLoaded, children }) => {
  useEffect(() => {
    var observer = new MutationObserver(function (mutations) {
      mutations[0].target.removeAttribute("class");
      mutations[0].target.removeAttribute("style");
      // TODO: Add hidden input for the following, add to head or data-layer
      // {{GA User ID}}
      // {{GA Cookie User ID}}
      // {{GA EM User ID}}
      // {{GA Page}}
      // {{GA Page}}
      // {{GA Date}}
      // {{GA Cookie Date}}
      // {{GA User ID - User}}
    });
    var form = document.getElementById("mktoForm_1638");
    observer.observe(form, {
      attributes: true,
    });
    return () => {
      window.MktoForms2.loadForm("//info.ujet.co", "205-VHT-559", 1024);
    };
  }, []);

  const onScriptLoad = () => {
    return new Promise((resolve) => {
      const data = window.MktoForms2.loadForm(
        "//info.ujet.co",
        "205-VHT-559",
        1638
      );
      data.whenReady(resolve);
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
