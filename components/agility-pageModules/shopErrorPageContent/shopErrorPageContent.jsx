import ButtonFooter from "../../../shop/components/buttons/button-footer";
import styles from "../../../shop/components/packages/packages.module.scss";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import layout from "../../../shop/styles/layout.module.scss";
import shop from "../../../shop/styles/globals.module.scss";
import GlobalContext from "../../../context";
import { useRouter } from "next/router";

const ShopErrorPageContent = () => {
  const [sfError, setSfError] = useState(null);
  const [previousStep, setPreviousStep] = useState(null);
  const [errorMsg, setErrorMsg] = useState(
    "Something went wrong while creating the order."
  );
  const { formData } = useContext(GlobalContext);
  const router = useRouter();
  useEffect(() => {
    if (
      !Boolean(formData?.contactInfo) ||
      (!formData?.freeFlow && !Boolean(formData?.primaryId))
    ) {
      window.location.replace("/shop");
    }
  }, []);

  useEffect(() => {
    if (router.query !== {}) {
      if (router.query.slug[0] !== "error" && router.query.slug.length !== 2)
        window.location.replace("/shop");
      if (router.query.slug[1] === "sf") {
        setSfError(true);
        setErrorMsg("Something went wrong.");
      }
      if (router.query.previous) {
        setPreviousStep(router.query.previous);
      }
    }
  }, [router]);

  return (
    <div className={shop.shop}>
      <div
        className={`${layout.container} ${layout.grid} ${layout["mb-30px"]} ${layout["align-center"]}`}
      >
        <div className={`${layout.col} ${layout["mb-20px"]}`}>
          <h1 className={layout["page-title"]}>An Error Occured</h1>
          <div
            className={`${layout["m-container-width"]} ${layout.inner} ${layout["align-center"]} ${layout["w-700"]} ${layout["text-left"]}`}
          >
            <p
              className={`${layout["page-subtitle"]} ${layout["error-text"]} ${layout["mb-20px"]}`}
            >
              {errorMsg}
            </p>
            <div className={`${styles["align-center"]}`}>
              <p>
                For questions please reach out to{" "}
                <Link prefetch={false} href="mailto:support@ujet.cx">
                  <a className={layout["link"]}>support@ujet.cx</a>
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className={styles.container}>
        <div className={`${layout.container} ${layout.grid}`}>
          <div className={layout.row}>
            {previousStep && <ButtonFooter prevStep={`/${previousStep}`} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopErrorPageContent;
