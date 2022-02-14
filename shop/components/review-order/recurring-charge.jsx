import { Component } from "react";
import review from "./review-order.module.scss";
import layout from "../../styles/layout.module.scss";

class RecurringCharge extends Component {
  render() {
    return (
      <div className={review["review-wrap"]}>
        <div className={review["mlr-30px"]}>
          <p>
            Recurring plans will auto-renew using the payment method on file
            that you use today.
          </p>

          {/* <div className={`${review["flex-liner"]} ${review["mt-20px"]}`}>
            <p className={layout.bold}> Recurring Annual Chanrge:</p>{" "}
            <p className={`${layout.bold} ${review["w-300px"]}`}>
              $1300.00{" "}
              <span className={`${review["text-400"]} ${review["text-small"]}`}>
                ( plus applicable taxes & fees ) Next renewal on July 15, 2022
              </span>
            </p>
          </div> */}
        </div>
      </div>
    );
  }
}
export default RecurringCharge;
