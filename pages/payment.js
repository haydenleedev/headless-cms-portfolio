/* eslint-disable @next/next/no-sync-scripts */
import FooterMenu from "../shop/components/layout/footer/footer";
import PageTitle from "../shop/components/layout/page-title/page-title";
import Loader from "../shop/components/loader/loader";
import styles from "../shop/components/packages/packages.module.scss";
import NavigationStep from "../shop/components/progress-bar/navigation-step";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import layout from "../shop/styles/layout.module.scss";
import shop from "../shop/styles/globals.module.scss";
import GlobalContext from "../context";
import { getShopSEOData } from "../shop/lib/agility";
import ShopSEO from "../shop/components/shopSEO";
import Button from "../shop/components/buttons/button";
import { checkRequiredSafariVersion } from "../utils/validation";

export default function Payment({ seo }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createResponse, setCreateResponse] = useState(null);
  const [refId, setRefId] = useState(null);
  const { formData, updateFormData } = useContext(GlobalContext);
  const [isOutdatedSafari, setIsOutdatedSafari] = useState(
    checkRequiredSafariVersion({
      desktop: 13,
      mobile: 14,
    })
  );
  const handleError = async (errorCode, errorMessage) => {
    switch (errorCode) {
      case "Attempt_Exceed_Limitation":
        setError("Please try again.");
        break;
      case "ReCaptcha_Validation_Failed":
        setError("Please try again.");
        break;
      case "Submit_Too_Quick":
        setError("Please try again.");
        break;
      default:
        setError(errorMessage);

        break;
    }
    getSignature();
  };

  const handleCallbackResponse = (e) => {
    if (
      e.origin === process.env.NEXT_PUBLIC_SITE_URL &&
      e.data.callbackPageResponse
    ) {
      if (e.data.refId) {
        setRefId(e.data.refId);
        // reference: https://knowledgecenter.zuora.com/Billing/Billing_and_Payments/LA_Hosted_Payment_Pages/B_Payment_Pages_2.0/Advanced_Security_Measures_for_Payment_Pages_2.0
      } else if (e.data.errorCode) {
        handleError(e.data.errorCode, e.data.errorMessage);
      }
    }
  };

  useEffect(() => {
    if (isOutdatedSafari && createResponse) router.push("/shop-contact-us");
    if (refId && (!formData.account || !formData.contact)) {
      updateFormData({
        account: createResponse.account,
        contact: createResponse.contact,
        contactInfo: createResponse.contactInfo,
        hpmCreditCardPaymentMethodId: refId,
      });
      router.push("/review-order");
    } else if (refId && formData.account && formData.contact) {
      updateFormData({
        account: createResponse.account,
        contact: createResponse.contact,
        contactInfo: createResponse.contactInfo,
        hpmCreditCardPaymentMethodId: refId,
      });
      router.push("/review-order");
    }
  }, [refId, createResponse]);

  function callback(response) {
    if (!response.success) {
      handleError(response.errorCode, response.errorMessage);
    } else {
      setRefId(response.refId);
    }
  }

  async function createAccountContact() {
    try {
      const body = {
        contactInfo: formData.contactInfo,
        account: formData.account,
        contact: formData.contact,
      };
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/salesforce?create=1`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      const data = await result.json();
      if (data.error && data.cause) {
        router.push(
          `/contact-information?error=${encodeURIComponent(data.cause)}`
        );
      } else if (
        (data.error && !data.cause) ||
        (data.error === null && data.cause === null)
      ) {
        router.push("/error/sf?previous=payment");
      } else {
        if (!data.account) router.push("/error/sf?previous=payment");
        setCreateResponse(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const errorMessageCallback = (key, code, message, rawGatewayInfo) => {
    if (key !== "error") {
      switch (key) {
        case "creditCardNumber":
          setError("Invalid Card Number");
          break;
        case "cardSecurityCode":
          setError("Invalid CVV Number");
          break;
        case "creditCardExpirationYear":
          setError("Invalid credit card expiration year");
          break;
        case "creditCardExpirationMonth":
          setError("Invalid credit card expiration month");
          break;
        case "creditCardType":
          setError("Invalid Card Type");
          break;
        default:
          setError(message);
          break;
      }
    }
  };

  const loadHostedPage = (signData) => {
    let params = {
      tenantId: signData.tenantId,
      id: process.env.NEXT_PUBLIC_ZUORA_HOSTED_PAGE_ID,
      token: `${signData.token}`,
      signature: `${signData.signature}`,
      key: `${signData.key}`,
      style: "inline",
      submitEnabled: "false",
      url: `${process.env.NEXT_PUBLIC_ZUORA_PAYMENT_URL}/apps/PublicHostedPageLite.do`,
      paymentGateway: process.env.NEXT_PUBLIC_ZUORA_PAYMENT_GATEWAY_NAME,
    };

    Z.setEventHandler("onloadCallback", function () {
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 6000);
      if (!createResponse) {
        createAccountContact();
      }
    });

    //Z.render(params, {}, callback);
    Z.renderWithErrorHandler(params, {}, callback, errorMessageCallback);
    Z.runAfterRender(errorMessageCallback);
  };

  const getSignature = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signatures`
      );
      const data = await response.json();
      await loadHostedPage(data.signatureData);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      !formData?.contactInfo ||
      (!formData?.freeFlow && !formData?.primaryId)
    ) {
      console.log("formData", formData);
      window.location.replace("/shop");
    } else {
      window.addEventListener("message", handleCallbackResponse);
      getSignature();
    }
    return () => {
      window.removeEventListener("message", handleCallbackResponse);
    };
  }, []);

  function submitPage() {
    Z.submit();
  }

  return (
    <React.Fragment>
      {seo && (
        <ShopSEO seo={seo}>
          <script
            type="text/javascript"
            src="https://static.zuora.com/Resources/libs/hosted/1.3.1/zuora-min.js"
          ></script>
        </ShopSEO>
      )}
      <div className={shop.shop}>
        <NavigationStep progress={4} />
        <main role="main" className={`${layout.main} ${styles["m-0px"]}`}>
          <PageTitle title="Payment Details" />
          {loading && <Loader />}
          <section className={isOutdatedSafari ? "is-hidden" : ""}>
            <div className={shop.paymentPageContent}>
              {error && !loading && (
                <p
                  className={`${layout["error-notice"]} ${layout["plr-20px"]} ${layout["ptb-10px"]} align-center`}
                >
                  {error}
                </p>
              )}
              <div
                className={`${layout["align-center"]} ${layout["mb-20px"]} ${
                  loading ? "is-hidden" : ""
                }`}
                id="zuora_payment"
              ></div>
              {!loading && (
                <Button
                  color="btn-orange"
                  size="btn-big"
                  text={createResponse ? "Submit" : "Loading..."}
                  onClick={submitPage}
                  disable={!createResponse?.account}
                />
              )}
            </div>
          </section>
          {isOutdatedSafari && !loading && (
            <div className="heading-5 align-center">Please wait...</div>
          )}
        </main>
        <FooterMenu />
      </div>
    </React.Fragment>
  );
}

export const getStaticProps = async (context) => {
  const { payment } = await getShopSEOData();
  return {
    props: { seo: payment },
  };
};
