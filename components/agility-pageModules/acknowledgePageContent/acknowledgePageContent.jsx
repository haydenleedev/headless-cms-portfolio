import ButtonFooter from "../../../shop/components/buttons/button-footer";
import Loader from "../../../shop/components/loader/loader";
import styles from "../../../shop/components/packages/packages.module.scss";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import layout from "../../../shop/styles/layout.module.scss";
import shop from "../../../shop/styles/globals.module.scss";
import GlobalContext from "../../../context";
import { useRouter } from "next/router";

const AcknowledgePageContent = () => {
  const [loading, setLoading] = useState(true);
  const [isFree, setIsFree] = useState(false);
  const router = useRouter();
  const { formData } = useContext(GlobalContext);
  useEffect(() => {
    if (
      !Boolean(formData?.contactInfo) ||
      (!formData?.freeFlow && !Boolean(formData?.primaryId))
    ) {
      window.location.replace("/shop");
      setLoading(false);
    } else {
      if (
        formData &&
        ((formData.freeFlow && formData.leadId) ||
          (!formData.freeFlow && formData.orderId))
      ) {
        setIsFree(formData.freeFlow);
        setLoading(false);
      } else {
        if (formData.freeFlow) router.push("/error/free-trial");
        else router.push("/error/paid-plan?step=acknowledge");
      }
    }
  }, []);

  return (
    <div className={shop.shop}>
      <div
        className={`${layout.container} ${layout.grid} ${layout["mb-30px"]} ${layout["align-center"]}`}
      >
        <div className={`${layout.col} ${layout["mb-20px"]}`}>
          <h1 className={layout["page-title"]}>Confirmation</h1>
          <div
            className={`${layout["m-container-width"]} ${layout.inner} ${layout["align-center"]} ${layout["w-700"]} ${layout["text-left"]}`}
          >
            {loading ? (
              <Loader />
            ) : isFree ? (
              <>
                <p
                  className={`${layout["page-subtitle"]} ${layout["mb-20px"]}`}
                >
                  Thank you for your order!
                </p>
                <p className={layout["pt-20px"]}>
                  An assigned implementation manager will review your submission
                  and contact the email address provided to help you get started
                  with your new trial account! This will include access to
                  documentation, our support portal, and your new UJET portal.
                </p>
                <p>Please allow 2 business days for this review.</p>

                <p className={layout["pt-20px"]}>
                  For questions please reach out to{" "}
                  <Link href="mailto:sales@ujet.cx" prefetch={false}>
                    <a className={layout["link"]}>sales@ujet.cx</a>
                  </Link>
                  .
                </p>
              </>
            ) : (
              <>
                <p>You will receive a confirmation email shortly.</p>
                <p className={layout["pt-20px"]}>
                  An assigned implementation manager will review your purchase
                  and contact the email address provided to help you get started
                  with your new UJET account! This will include access to
                  documentation, our support portal, and your new UJET portal.
                </p>
                <p className={layout["pt-20px"]}>
                  Please allow 2 business days for this review.
                </p>
                <p className={layout["pt-20px"]}>
                  For questions please reach out to{" "}
                  <Link href="mailto:support@ujet.cx" prefetch={false}>
                    <a className={layout["link"]}>support@ujet.cx</a>
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <section className={styles.container}>
        <div className={`${layout.container} ${layout.grid}`}>
          <div className={layout.row}>
            <ButtonFooter nextStep="/" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcknowledgePageContent;
