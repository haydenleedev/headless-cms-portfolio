import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PaymentCallbackPage = () => {
  const { query } = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent && query !== {}) {
      if (query.success === "true") {
        window.parent.postMessage({
          callbackPageResponse: true,
          refId: query.refId,
        });
      } else {
        window.parent.postMessage({
          callbackPageResponse: true,
          errorCode: query.errorCode,
          errorMessage: query.errorMessage,
        });
      }
    }
  }, [query]);

  return null;
};

export default PaymentCallbackPage;
