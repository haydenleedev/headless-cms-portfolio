import { Component } from "react";
import review from "./review-order.module.scss";

class TodaysCharge extends Component {
  render() {
    return (
      <div className={review["review-wrap"]}>
        <h2 className={review["review-title"]}>Order Details</h2>
        <div className={review["mlr-30px"]}>
          {this.props.formData.freeFlow === true ? (
            <>
              <ul className={review["space-between-wrap"]}>
                <li>
                  Free package <span>$0</span>
                </li>
              </ul>
              <div
                className={`${review["space-between-wrap"]} ${review["top-divider"]}`}
              >
                <div>
                  <p>Total Before Applicable Tax: </p> <p>$0.00</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <ul className={review["space-between-wrap"]}>
                {this.props.preview?.subscriptions?.previewResult && (
                  <>
                    {this.props.preview?.subscriptions.previewResult.invoices[0].invoiceItems.map(
                      (item, index) => {
                        return (
                          <li key={index}>
                            {item.chargeName} with{" "}
                            {item.additionalInfo.quantity}{" "}
                            {item.additionalInfo.quantity > 1
                              ? "licenses"
                              : "license"}
                            <span>
                              ${item.amountWithoutTax.toLocaleString("en-US")}
                            </span>
                          </li>
                        );
                      }
                    )}
                  </>
                )}
              </ul>
              <div
                className={`${review["space-between-wrap"]} ${review["top-divider"]}`}
              >
                <div>
                  <p>Total Before Applicable Tax: </p>{" "}
                  <p>
                    $
                    {this.props.preview.subscriptions.previewResult.invoices[0].amount.toLocaleString(
                      "en-US"
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
export default TodaysCharge;
