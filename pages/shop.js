import PageTitle from "../shop/components/layout/page-title/page-title";
import Button from "../shop/components/buttons/button";
import buttonStyles from "../shop/components/buttons/buttons.module.scss";
import ComparisonChart from "../shop/components/comparison-chart/comparison-chart";
import FreeTrial from "../shop/components/free-trial/free-trial";
import Backdrop from "../shop/components/modals/Backdrop";
import FreeLimitationModal from "../shop/components/modals/free-limitation-modal";
import ProductFeatures from "../shop/components/packages/features";
import FooterMenu from "../shop/components/layout/footer/footer";
import styles from "../shop/components/packages/packages.module.scss";
import NavigationStep from "../shop/components/progress-bar/navigation-step";
import { getHomePageData, refreshOAuthToken } from "../shop/lib/zuora";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import layout from "../shop/styles/layout.module.scss";
import shop from "../shop/styles/globals.module.scss";
import GlobalContext from "../context";
import { getShopSEOData } from "../shop/lib/agility";
import ShopSEO from "../shop/components/shopSEO";
import { getReducedZuoraObject } from "../shop/utils/formatData";
import { checkRequiredSafariVersion } from "../utils/validation";
import { addDataLayerEventTriggers } from "../utils/dataLayer";
import SafariDisclaimer from "../shop/components/safariDisclaimer/safariDisclaimer";

export default function Home({
  data,
  freeProduct,
  includedFeaturesChartData,
  addOnsChartData,
  freeTrialEnabled,
  seo,
}) {
  const [isActive, setActive] = useState(null);
  const [isFree, setFree] = useState(false);
  const [showCompDiv, setShowCompDiv] = useState(false);
  const [productId, setProductId] = useState(null);
  const router = useRouter();
  let initialPageLoaded = false;

  const compareDiv = () => {
    setShowCompDiv(!showCompDiv);
  };

  const safariDisclaimerContent = checkRequiredSafariVersion({
    desktop: 13,
    mobile: 14,
  });
  const { formData, updateFormData, resetData } = useContext(GlobalContext);

  useEffect(() => {
    addDataLayerEventTriggers(router);
    router.events.on("routeChangeComplete", () => {
      // Track virtual page views (Bombora)
      if (window._ml && initialPageLoaded) {
        window._ml.q = window._ml.q || [];
        window._ml.q.push(["track"]);
      } else if (!initialPageLoaded) {
        initialPageLoaded = true;
      }
    });
  }, []);

  const hasPromotion = (planType, promotionActive) => {
    const item = data.find((product) => product.name.includes("Promotion"));
    return promotionActive && item.PlanType__c === planType ? item : null;
  };

  const toggleSelected = (item, index = 1) => {
    updateFormData({
      primaryId: item.primaryId,
      productId: item.id,
      selectedProduct: item,
      productName: item.name,
      freeFlow: false,
    });
    setActive(index);
    setProductId(item.primaryId);
    router.push(`/customize/${item.primaryId}`);
  };

  // Preselecting Enterprise Product
  // useEffect(() => {
  //   if (!Boolean(formData?.primaryId)) {
  //     updateFormData({
  //       primaryId: data[2].primaryId,
  //       productId: data[2].primaryId,
  //       selectedProduct: data[2],
  //       productName: data[2].name,
  //     });
  //     setActive(2);
  //     setProductId(data[2].primaryId);
  //   }
  // }, []);

  useEffect(() => {
    resetData();
  }, []);

  return (
    <React.Fragment>
      {seo && <ShopSEO seo={seo} />}
      <div className={shop.shop}>
        <NavigationStep progress={1} />
        <main role="main">
          {safariDisclaimerContent && (
            <SafariDisclaimer {...safariDisclaimerContent} />
          )}
          <PageTitle title="Select Your Package and Build Your Solution" />

          {isFree == true ? (
            <>
              <FreeLimitationModal
                onClick={(e) => {
                  e.preventDefault();
                  document.body.className = null;
                  setFree(false);
                }}
              />
              <Backdrop />
            </>
          ) : null}
          {freeProduct && freeTrialEnabled && (
            <section className={layout["m-container-width"]}>
              <div
                className={`${layout.container} ${layout.grid} ${layout["align-center"]} ${styles["mb-10px"]} pb-2`}
              >
                <div className={layout.row}>
                  <div className={`${layout.col}`}>
                    <div
                      className={`${layout.inner} ${layout.selected}`}
                      onClick={(e) => {
                        if (window.innerWidth > 800) {
                          e.preventDefault();
                          document.body.className = layout.lock;
                          setFree(true);
                        }
                      }}
                    >
                      <FreeTrial
                        freeProduct={freeProduct}
                        openModal={() => setFree(true)}
                      />
                      <span
                        className={styles.cta}
                        onClick={(e) => {
                          e.preventDefault();
                          setFree(true);
                          document.body.className = layout.lock;
                        }}
                      >
                        Get Started &#8594;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {data && (
            <section className={layout["m-container-width"]}>
              <div
                className={`${layout.container} ${layout.grid} ${layout["align-center"]}`}
              >
                <div className={layout.row}>
                  {data
                    .filter(
                      (ele) =>
                        !ele.name.includes("Promotion") &&
                        ele.SalesChannel__c == "ecom"
                    )
                    .map((item, index) => {
                      const promotion = hasPromotion(
                        item.PlanType__c,
                        item.promotionActive
                      );
                      return (
                        <div
                          key={index}
                          className={`${layout.col} ${layout["col-4"]} ${
                            promotion
                              ? `${styles.promotion} ${layout.col} ${layout["col-4"]}`
                              : `${layout.col} ${layout["col-4"]}`
                          }`}
                        >
                          {item.name.includes("Enterprise") && (
                            <span className={styles["flag-orange"]}>
                              Most popular
                            </span>
                          )}

                          {promotion ? (
                            <>
                              <span className={styles["flag-orange"]}>
                                SMB Promo!
                              </span>
                              <div className={styles.headerblock}>
                                <span className={styles.ad}>
                                  First 25 users at $39/mo
                                </span>
                                <span className={styles[`ad-small`]}>
                                  Offer valid through 3/31/22
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={styles.headerblock}></div>
                            </>
                          )}

                          <div
                            className={
                              item.name.includes("Enterprise")
                                ? `${styles["no-top-border"]} ${layout.inner} ${layout["m-pb-0"]} ${layout.selected}`
                                : `${styles["no-top-border"]} ${layout.inner} ${layout["m-pb-0"]}`
                            }
                          >
                            <h2
                              className={`${styles["card-title"]} ${styles["pb-20px"]}`}
                            >
                              {item.PlanType__c.split(" ")[0]}
                            </h2>

                            <p
                              className={`${styles.pricing} ${styles["pb-20px"]}`}
                            >
                              <ins>
                                {/* ${promotion ? promotion.price : item.price} */}
                                ${item.price}
                                <span
                                  className={`${styles.pricingSmall} ${styles["pb-20px"]}`}
                                >
                                  /mo
                                </span>
                              </ins>

                              {/* promotion && (
                              <>
                                <del>
                                  ${item.price}
                                  <span
                                    className={`${styles.pricingSmall} ${styles["pb-20px"]}`}
                                  >
                                    {" "}
                                    /mo
                                  </span>
                                </del>
                              </>
                            ) */}
                            </p>

                            <div className={styles["b-divider"]}>
                              <button
                                className={
                                  /* isActive === index
                                 || */
                                  formData.primaryId === item.primaryId
                                    ? `${buttonStyles["btn"]} ${buttonStyles["btn-blue"]} ${buttonStyles["btn-big"]} ${buttonStyles["clicked"]}`
                                    : `${buttonStyles["btn"]} ${buttonStyles["btn-blue"]} ${buttonStyles["btn-big"]}`
                                }
                                onClick={() =>
                                  promotion
                                    ? toggleSelected(promotion, index)
                                    : toggleSelected(item, index)
                                }
                              >
                                <span>Buy Now</span>
                              </button>
                            </div>
                            <ProductFeatures
                              product={promotion || item}
                              productId={index}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          )}

          <section>
            <div
              className={`${layout.container} ${styles["pt-30px"]} ${styles["pb-50px"]} ${layout["align-center"]}`}
            >
              <Button
                color="btn-skyblue"
                size="btn-medium"
                addClass={
                  showCompDiv
                    ? `${styles["plus"]} ${styles["rotated"]}`
                    : `${styles["plus"]}`
                }
                text="Compare all plans and features"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo(0, 2000);
                  compareDiv();
                }}
              />
            </div>

            <div
              className={
                showCompDiv
                  ? `${layout["open-container"]} ${styles["comp-table-wrap"]} ${styles["show-table"]}`
                  : `${layout["open-container"]} ${styles["comp-table-wrap"]}`
              }
            >
              <span
                className={`${layout.triangle} ${layout["align-center"]}`}
              ></span>
              <div
                className={`${layout.wrap} ${layout.grid} ${layout["align-center"]}`}
              >
                <div className={layout.row}>
                  <ComparisonChart
                    data={data.filter(
                      (ele) =>
                        !ele.name.includes("Promotion") &&
                        ele.SalesChannel__c == "ecom"
                    )}
                    promotions={data.map((product) => {
                      return hasPromotion(
                        product.PlanType__c,
                        product.promotionActive
                      );
                    })}
                    includedFeaturesChartData={includedFeaturesChartData}
                    addOnsChartData={addOnsChartData}
                    setFree={setFree}
                    toggleSelected={toggleSelected}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* {isFree != true && formData.primaryId ? (
          <ButtonFooter
            scroll={layout.scroll}
            nextStep={`/customize/${formData.primaryId}`}
          />
        ) : (
          <></>
        )} */}
        </main>
        <FooterMenu />
      </div>
    </React.Fragment>
  );
}

// Building Static Page at build time
export async function getStaticProps() {
  try {
    const res = await refreshOAuthToken();
    let {
      products,
      includedFeaturesChartData,
      addOnsChartData,
      freeTrialEnabled,
    } = await getHomePageData(res);
    const { shop } = await getShopSEOData();
    const freeProduct = products[products.length - 1];
    // Removing Free Product Data
    products.pop();
    return {
      props: {
        data: getReducedZuoraObject(products),
        freeProduct,
        includedFeaturesChartData,
        addOnsChartData,
        freeTrialEnabled,
        fallback: false,
        seo: shop,
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
        freeProduct: [],
        includedFeaturesChartData: [],
        addOnsChartData: [],
        freeTrialEnabled: false,
        fallback: false,
        seo: null,
      },
    };
  }
}
