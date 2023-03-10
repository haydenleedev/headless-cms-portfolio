import ButtonFooter from "../shop/components/buttons/button-footer";
import NavigationStep from "../shop/components/progress-bar/navigation-step";
import RecurringCharge from "../shop/components/review-order/recurring-charge";
import review from "../shop/components/review-order/review-order.module.scss";
import TodaysCharge from "../shop/components/review-order/todays-charge";
import { useRouter } from "next/dist/client/router";
import FooterMenu from "../shop/components/layout/footer/footer";
import React, { useContext, useEffect, useState } from "react";
import layout from "../shop/styles/layout.module.scss";
import Loader from "../shop/components/loader/loader";
import PageTitle from "../shop/components/layout/page-title/page-title";
import shop from "../shop/styles/globals.module.scss";
import GlobalContext from "../context";
import { getShopSEOData } from "../shop/lib/agility";
import ShopSEO from "../shop/components/shopSEO";

export default function ReviewOrder({ seo }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { formData, updateFormData } = useContext(GlobalContext);

  useEffect(() => {
    if (
      !Boolean(formData?.contactInfo) ||
      (!formData?.freeFlow && !Boolean(formData?.primaryId))
    ) {
      window.location.replace("/shop");
    } else {
      if (!formData?.freeFlow) {
        createOrderPreview();
      }
    }
  }, []);

  // Create Order Preview for Paid Flow
  const createOrderPreview = async () => {
    setLoading(true);
    let addOnsData = [];
    if (formData.addOns?.length > 0) {
      // Filtering Add-Ons according to the frequency of the Base product.
      formData.addOns.forEach((element) => {
        const addOnProduct = formData.addOnsData.find((x) => x.id === element);
        const ratePlan = addOnProduct?.productRatePlans.filter(
          (x) => x.BillingFrequency__c === formData.frequency
        );
        addOnsData.push({
          id: addOnProduct.id,
          name: addOnProduct.name,
          ratePlanId: ratePlan[0].id,
          ratePlanChargeId: ratePlan[0].productRatePlanCharges.filter(
            (element) => element.model === "PerUnit"
          )[0].id,
        });
      });
    }

    const orderDetails = {
      baseProduct: {
        ratePlanId: formData.ratePlanId,
        ratePlanChargeId: formData.ratePlanChargeId,
      },
      addOns: addOnsData,
      implementations: formData.implementationId,
      licenses: formData.licenses,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getPreview`,
      {
        method: "POST",
        body: JSON.stringify(orderDetails),
      }
    );
    const data = await response.json();
    setOrderData(data);
    setLoading(false);
  };

  // Create Lead for Free Flow
  const onContinue = async () => {
    try {
      if (formData && formData.freeFlow && formData.contactInfo) {
        setLoading(true);
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/createSFLead?leadInfo=${JSON.stringify(formData.contactInfo)}`
        );
        const lead = await response.json();
        updateFormData({ leadId: lead.Id });
        setLoading(false);
        router.push("/acknowledge");
      }
    } catch (error) {
      router.push("/error/free-trial?previous=review-order");
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      setLoading2(true);
      let addOnsData = [];
      if (formData.addOns?.length > 0) {
        formData.addOns.forEach((element) => {
          const addOnProduct = formData.addOnsData.find(
            (x) => x.id === element
          );
          const ratePlan = addOnProduct?.productRatePlans.filter(
            (x) => x.BillingFrequency__c === formData.frequency
          );
          addOnsData.push({
            id: addOnProduct.id,
            name: addOnProduct.name,
            ratePlanId: ratePlan[0].id,
            ratePlanChargeId: ratePlan[0].productRatePlanCharges.filter(
              (element) => element.model === "PerUnit"
            )[0].id,
          });
        });
      }

      const orderDetails = {
        accountNumber: formData.account.Id,
        contactInfo: formData.contactInfo,
        baseProduct: {
          ratePlanId: formData.ratePlanId,
          ratePlanChargeId: formData.ratePlanChargeId,
        },
        addOns: addOnsData,
        implementations: formData.implementationId,
        hpmCreditCardPaymentMethodId: formData.hpmCreditCardPaymentMethodId,
        licenses: formData.licenses,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addSubscription`,
        {
          method: "POST",
          body: JSON.stringify(orderDetails),
        }
      );
      const data = await response.json();
      if (data.subscriptions.success) {
        updateFormData({ orderId: data.subscriptions.orderNumber });
      }
      setLoading2(false);
      router.push("/acknowledge");
    } catch (error) {
      router.push(
        `/error/paid-plan?previous=review-order&step=review-order&errorMessage=${encodeURIComponent(
          error.message
        )}`
      );
      setLoading2(false);
    }
  };

  return (
    <React.Fragment>
      {seo && <ShopSEO seo={seo} />}
      <div className={shop.shop}>
        <NavigationStep progress={5} freeFlow={formData.freeFlow} />

        <main role="main">
          <PageTitle title="Review Order" />
          {loading2 && <Loader />}
          {loading ? (
            <Loader />
          ) : (
            <section
              className={`${layout["m-container-width"]} ${layout.container} ${layout.grid} ${layout["mb-30px"]}`}
            >
              <div
                className={`${layout.inner} ${layout["narrow-wrap"]} ${layout["mb-30px"]}`}
              >
                <div className={review["table-headline-blue"]}>
                  Today's Charge
                </div>
                {(orderData || formData?.freeFlow) && (
                  <TodaysCharge formData={formData} preview={orderData} />
                )}
                {!formData?.freeFlow && (
                  <>
                    <div className={review["table-headline-blue"]}>
                      Recurring Charge
                    </div>
                    <RecurringCharge />
                  </>
                )}
              </div>
            </section>
          )}

          {!loading2 && !loading && (
            <ButtonFooter
              nextStep="/acknowledge"
              /*              prevStep={
                formData?.freeFlow == true
                  ? "/free-contact-information"
                  : "/payment"
              } */
              onContinue={formData.freeFlow ? onContinue : createOrder}
            />
          )}
        </main>
        <FooterMenu />
      </div>
    </React.Fragment>
  );
}

export const getStaticProps = async (context) => {
  const { reviewOrder } = await getShopSEOData();
  return {
    props: { seo: reviewOrder },
  };
};
