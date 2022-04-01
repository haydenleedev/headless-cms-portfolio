import PageTitle from "../../shop/components/layout/page-title/page-title";
import ButtonFooter from "../../shop/components/buttons/button-footer";
import AddOns from "../../shop/components/customize/add-ons";
import customize from "../../shop/components/customize/customize.module.scss";
import licenses from "../../shop/components/customize/licenses.module.scss";
import SectionTitle from "../../shop/components/customize/section-title";
import AddOnsModal from "../../shop/components/modals/add-on-modal";
import Backdrop from "../../shop/components/modals/Backdrop2";
import NavigationStep from "../../shop/components/progress-bar/navigation-step";
import FooterMenu from "../../shop/components/layout/footer/footer";
import {
  addOnServices2,
  getHomePageData,
  refreshOAuthToken,
} from "../../shop/lib/zuora";
import React, { useContext, useEffect, useState } from "react";
import layout from "../../shop/styles/layout.module.scss";
import shop from "../../shop/styles/globals.module.scss";
import GlobalContext from "../../context";
import ShopSEO from "../../shop/components/shopSEO";
import { getShopSEOData } from "../../shop/lib/agility";
import { getReducedZuoraObject } from "../../shop/utils/formatData";

export default function Customize({ addOns, /* products, */ seo }) {
  const [lic, setLicenses] = useState(10);
  const [modal, setModal] = useState(false);
  const { formData, updateFormData } = useContext(GlobalContext);

  useEffect(() => {
    if (!Boolean(formData?.primaryId)) {
      window.location.replace("/shop");
    } else {
      updateFormData({
        licenses: Boolean(formData.licenses) ? formData.licenses : 10,
        //services: addOns,
        //products: products,
      });
    }
  }, []);

  return (
    <React.Fragment>
      {seo && <ShopSEO seo={seo} />}
      <div className={shop.shop}>
        <NavigationStep progress={1} />

        <main role="main">
          <PageTitle title="Customize" />

          <section
            className={`${layout["m-container-width"]} ${layout.container} ${layout.grid} ${layout["mb-30px"]}`}
          >
            <div className={`${layout.inner} ${customize.selections}`}>
              <SectionTitle
                order="1"
                title="How many licenses do you need?"
                wrappingTag="label"
                htmlFor="licenses"
              />
              <div
                className={`${licenses["input-number-wrap"]} ${customize["mlr-38px"]}`}
              >
                <div className={licenses["input-number"]}>
                  <div className={licenses["input-small"]}>
                    <input
                      id="licenses"
                      type="number"
                      autoComplete="off"
                      aria-label="Licenses"
                      min="1"
                      max={
                        formData.selectedProduct &&
                        formData.selectedProduct.promotionActive &&
                        formData.selectedProduct.name.includes("Promotion")
                          ? 25
                          : null
                      }
                      defaultValue={
                        Boolean(formData.licenses) ? formData.licenses : 10
                      }
                      step="1"
                      name="licenses"
                      className={licenses["number-input"]}
                      role="spinbutton"
                      onChange={(value) => {
                        setLicenses(value.target.value);
                        updateFormData({
                          licenses: value.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <span
                  className={`${licenses["text-regular"]} ${customize["ml-20px"]}`}
                ></span>
              </div>
              {addOns && addOns.length > 0 && (
                <>
                  <SectionTitle order="2" title="Choose Add-Ons (Optional)" />
                  <AddOns data={addOns} />
                </>
              )}
              {addOns && addOns.length > 0 && formData.noAddOn && modal && (
                <>
                  <AddOnsModal data={addOns} setModal={setModal} />
                  <Backdrop onCancel={setModal} />
                </>
              )}
            </div>
          </section>
          <ButtonFooter
            nextStep={
              lic > 0 ? `/subscription-cycle/${formData?.primaryId}` : null
            }
            prevStep="/shop"
            setModal={setModal}
            addOns={addOns}
          />
        </main>
        <FooterMenu />
      </div>
    </React.Fragment>
  );
}

// Building multiple static copies of this page for different base license products
export const getStaticPaths = async () => {
  const res = await refreshOAuthToken();
  let { products } = await getHomePageData(res);
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

// Building Static Page
export const getStaticProps = async (context) => {
  const primaryId = context.params.id;
  const { customize } = await getShopSEOData();
  const accessToken = await refreshOAuthToken();
  const { addOns /* , products */ } = await addOnServices2(
    accessToken,
    primaryId
  );
  return {
    props: {
      addOns: getReducedZuoraObject(addOns),
      /* products, */ seo: customize,
    },
  };
};
