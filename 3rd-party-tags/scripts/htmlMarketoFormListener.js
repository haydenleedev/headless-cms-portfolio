import { getUtilityLibrary } from "../../utils/3rdPartyScripts";

const htmlMarketoFormListener = `
  (function (document, window, undefined) {
    var _ = ${getUtilityLibrary}();
    var dataLayer = window.dataLayer;
    const DEBUG_MODE = false;

    try {
      if (window.MktoForms2) {
        window.MktoForms2.whenReady(function (form) {
          var form_id = form.getId();
          var $form = form.getFormElem();

          dataLayer.push({
            event: "marketo.loaded",
            "marketo.form_id": form_id,
          });

          _.onElementAppear($form[0], 100, function () {
            window.dispatchEvent(new CustomEvent("marketoFormInView"));
            // dataLayer.push({
            //   event: "marketo.in_view",
            //   "marketo.form_id": form_id,
            // });
          });

          form.onSubmit(function () {
            if (!window.mktoSubmitPixelLoaded) {
              var gaUserId;
              var gaUserIdTag = document.getElementById("ga-user-id");
              if (gaUserIdTag) {
                gaUserId = gaUserIdTag.content;
              }
              var pixel = new Image();
              pixel.src =
                "https://tags.w55c.net/rs?id=d31fb015fc084e2d865b2a7d85a7c426&t=checkout&tx=" +
                gaUserId +
                "&sku=$SKUS&price=$price";
              pixel.onload = function () {
                window.mktoSubmitPixelLoaded = true;
              };
            }
            dataLayer.push({
              event: "marketo.submit",
              "marketo.form_id": form_id,
            });
          });

          form.onSuccess(function (values, followUpUrl) {
            window.dispatchEvent(new CustomEvent("marketoFormSuccess"));
            // dataLayer.push({
            //   event: "marketo.success",
            //   "marketo.form_id": form_id,
            //   "marketo.form_values": values,
            //   "marketo.follow_up_url": followUpUrl,
            // });
            // if({{Debug Mode}}){
            if (DEBUG_MODE) {
              console.log(values);
              return false;
            } else {
              return true;
            }
          });
        });
      }
    } catch (err) {
      // if({{Debug Mode}}){
      if (DEBUG_MODE) {
        console.log(err);
      }
    }
  })(document, window);
`;

export default htmlMarketoFormListener;
