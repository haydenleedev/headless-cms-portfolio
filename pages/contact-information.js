import ContactForm from "../shop/components/form/form";
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

export default function ContactInformation({ seo }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { formData, updateFormData } = useContext(GlobalContext);

  useEffect(() => {
    /* if (
      !Boolean(formData?.freeFlow) &&
      (!Boolean(formData?.primaryId) || !Boolean(formData?.licenses))
    ) {
      window.location.replace("/shop");
    } */
    if (router.query.error) {
      setError(decodeURIComponent(router.query.error));
    }
  }, []);

  const onContinue = async (contactInfo) => {
    try {
      setError(null);
      setLoading(true);
      window.scrollTo(0, 0);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/salesforce`,
        {
          method: "POST",
          body: JSON.stringify(contactInfo),
        }
      );
      const data = await result.json();
      if (data.error && data.cause) {
        setError(data.error);
        setLoading(false);
      } else if (
        (data.error && !data.cause) ||
        (data.error === null && data.cause === null)
      ) {
        router.push("/error/sf?previous=contact-information");
      } else {
        updateFormData(data);
        setLoading(false);
        router.push("/payment");
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {seo && <ShopSEO seo={seo} />}
      <div className={shop.shop}>
        <NavigationStep progress={3} />
        <main role="main">
          <PageTitle title="Contact Information" />
          <section className={styles.container}>
            {loading && <Loader />}
            <div className={`${layout.container} ${layout.grid}`}>
              <div className={`${layout.row} ${layout["pb-20px"]}`}>
                {error && (
                  <p
                    className={`${layout["error-notice"]} ${layout["plr-20px"]} ${layout["ptb-10px"]}`}
                  >
                    {error}
                  </p>
                )}
              </div>
            </div>
            <div className={`${layout.container} ${layout.grid}`}>
              <div className={layout.row}>
                <ContactForm loading={loading} onContinue={onContinue} />
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
  const { contactInformation } = await getShopSEOData();
  return {
    props: { seo: contactInformation },
  };
};
