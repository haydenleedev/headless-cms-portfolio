import PageTitle from "../shop/components/layout/page-title/page-title";
import FooterMenu from "../shop/components/layout/footer/footer";
import styles from "../shop/components/packages/packages.module.scss";
import NavigationStep from "../shop/components/progress-bar/navigation-step";
import React, { useContext, useEffect, useState } from "react";
import layout from "../shop/styles/layout.module.scss";
import shop from "../shop/styles/globals.module.scss";
import GlobalContext from "../context";
import { getShopSEOData } from "../shop/lib/agility";
import ShopSEO from "../shop/components/shopSEO";
import { Form, FormWrapper } from "../components/form/DEPRECATED_index";

export default function ContactInformation({ formID, seo }) {
  const [formLoaded, setFormLoaded] = useState(false);
  const { formData } = useContext(GlobalContext);
  useEffect(() => {
    if (!Boolean(formData?.freeFlow)) {
      window.location.replace("/shop");
    }
  }, []);

  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };

  return (
    <React.Fragment>
      {seo && <ShopSEO seo={seo} />}
      <div className={shop.shop}>
        <NavigationStep progress={3} freeFlow={formData.freeFlow} />

        <main role="main">
          <PageTitle title="Start Your Free Trial" />
          <section className={styles.container}>
            <div className={`${layout.container} ${layout.grid}`}>
              <div className={layout.row}>
                {/* <ContactForm loading={loading} onContinue={onContinue} /> */}
                <div className={styles.freeForm}>
                  <FormWrapper
                    handleSetFormLoaded={handleSetFormLoaded}
                    formID={formID}
                    channelEmail={true}
                  >
                    <Form
                      submitButtonText="Submit"
                      formLoaded={formLoaded}
                      formID={formID}
                    />
                  </FormWrapper>
                </div>
              </div>
            </div>
          </section>
        </main>
        <FooterMenu />
      </div>
    </React.Fragment>
  );
}

export const getStaticProps = async (context) => {
  const { freeContactInformation } = await getShopSEOData();
  return {
    props: {
      seo: freeContactInformation,
      formID: process.env.SHOP_FREE_TRIAL_MARKETO_ID || "1016",
    },
  };
};
