import PageTitle from "../../shop/components/layout/page-title/page-title";
import ButtonFooter from "../../shop/components/buttons/button-footer";
import Implementation from "../../shop/components/implementation-services/implementation-wrapper";
import FooterMenu from "../../shop/components/layout/footer/footer";
import NavigationStep from "../../shop/components/progress-bar/navigation-step";
import SubscriptionCycle from "../../shop/components/subscription-cycle/subscription-cycle-wrapper";
import {
  getHomePageData,
  getImplementation,
  refreshOAuthToken,
} from "../../shop/lib/zuora";
import React, { useContext, useEffect, useState } from "react";
import layout from "../../shop/styles/layout.module.scss";
import shop from "../../shop/styles/globals.module.scss";
import GlobalContext from "../../context";
import ShopSEO from "../../shop/components/shopSEO";
import { getShopSEOData } from "../../shop/lib/agility";
import { getReducedZuoraObject } from "../../shop/utils/formatData";

export default function Subscription({
  implementations,
  implementationsData,
  ratePlans,
  voiceUsage,
  seo,
}) {
  const [pageCheck, setPageCheck] = useState(false);
  const [rateCheck, setRateCheck] = useState(false);
  const { formData, updateFormData } = useContext(GlobalContext);

  useEffect(() => {
    if (!Boolean(formData?.primaryId)) {
      window.location.replace("/shop");
    }
  }, []);

  return (
    <React.Fragment>
      {seo && <ShopSEO seo={seo} />}
      <div className={shop.shop}>
        <NavigationStep progress={2} />

        <main role="main">
          <PageTitle title="Choose Subscription" />

          <section
            className={`${layout["m-container-width"]} ${layout.container} ${layout.grid} ${layout["mb-30px"]}`}
          >
            <div className={layout.inner}>
              {ratePlans?.length > 0 && voiceUsage && (
                <SubscriptionCycle
                  data={ratePlans}
                  voiceUsage={voiceUsage}
                  setRateCheck={setRateCheck}
                />
              )}
              {implementations?.length > 0 &&
                implementationsData &&
                formData.ratePlanId && (
                  <Implementation
                    data={implementations}
                    implementationsData={implementationsData}
                    setPageCheck={setPageCheck}
                  />
                )}
            </div>
          </section>
          {implementations?.length > 0 && ratePlans?.length > 0 && (
            <ButtonFooter
              scroll={layout.scroll}
              incomplete={pageCheck}
              nextStep={
                pageCheck === false && rateCheck === true
                  ? `/contact-information`
                  : null
              }
              prevStep={`/customize/${formData?.primaryId}`}
            />
          )}
        </main>
        <FooterMenu />
      </div>
    </React.Fragment>
  );
}

export const getStaticPaths = async () => {
  const res = await refreshOAuthToken();
  let { products } = await getHomePageData(res);

  // Removing Free Product Data
  products.pop();
  const paths = products.map((x) => {
    return {
      params: { id: x.primaryId.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

// Building multiple static copies of this page for different base license products
export const getStaticProps = async (context) => {
  const primaryId = context.params.id;
  const accessToken = await refreshOAuthToken();
  let { implementations, products, implementationServices, voiceUsage } =
    await getImplementation(accessToken);

  const { subscriptionCycle } = await getShopSEOData();
  // Sorting Implementation Plans
  const sortList = ["SMB+", "Premier", "Starter"];
  const sortedObj = implementations.sort((a, b) => {
    return (
      sortList.indexOf(a.implementationName) -
      sortList.indexOf(b.implementationName)
    );
  });

  const ratePlansData = await getRatePlans(primaryId, products);
  // Sorting Rate Plans
  const sortList2 = ["Monthly", "Annual"];
  const ratePlans = ratePlansData.sort((a, b) => {
    return (
      sortList2.indexOf(a.BillingFrequency__c) -
      sortList2.indexOf(b.BillingFrequency__c)
    );
  });

  return {
    props: {
      implementations: getReducedZuoraObject(sortedObj),
      implementationsData: implementationServices,
      ratePlans: getReducedZuoraObject(ratePlans),
      voiceUsage,
      seo: subscriptionCycle,
    },
  };
};

// Fetching Rate Plans of a License Product
export const getRatePlans = async (id, products) => {
  if (products.length > 0) {
    const product = products.find((x) => x.id === id);
    const plans = product?.productRatePlans;
    if (plans.length > 0) {
      // Filter for plans only which have "ecom" value.
      const filteredPlans = plans.filter((x) => x.SalesChannel__c === "ecom");
      for (let i = 0; i < filteredPlans.length; i++) {
        
        // Getting PerUnit price in USD
        let charges = filteredPlans[i].productRatePlanCharges.filter(
          (plan) => plan.model === "PerUnit"
        );


        let price = charges[0].pricing.filter(
          (prices) => prices.currency === "USD"
        );
        
        //
        if(typeof price == 'undefined') {
          price = charges[1].pricing.filter(
            (prices) => prices.currency === "USD"
          );
        }

        filteredPlans[i].price = price[0]?.price;
      }

      // remove promotion rate plan if promotion is not toggled on in agility.
      const finalFilteredPlans = filteredPlans.map((plan) => {
        if (!product.promotionActive && plan.name.includes("Promotion"))
          return null;
        return plan;
      });
      return finalFilteredPlans.filter((plan) => plan);
    } else {
      return [];
    }
  } else {
    return [];
  }
};
