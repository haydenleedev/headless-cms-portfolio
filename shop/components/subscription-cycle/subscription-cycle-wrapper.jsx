import { Component, Fragment } from "react";
import GlobalContext from "../../../context";
import layout from "../../styles/layout.module.scss";
import SubscriptionCard from "./subscription-card";
import subscription from "./subscription-cycle.module.scss";
import VoiceUsageCard from "./voice-usage-card.jsx";

class SubscriptionCycle extends Component {
  static contextType = GlobalContext;
  // need to define some properties to make detecting possible active promotions easier.
  constructor(props) {
    super(props);
    this.annualRatePlan = this.getAnnualRatePlan(props.data);
    this.monthlyRatePlan = props.data.find(
      (ratePlan) => ratePlan.BillingFrequency__c === "Monthly"
    );
  }
  componentDidMount() {
    if (this.context.formData.ratePlanId == null) {
      this.annual = layout.active;
      this.context.updateFormData({
        ratePlanId: this.annualRatePlan.id,
        ratePlanChargeId: this.annualRatePlan.productRatePlanCharges.filter(
          (element) => element.model === "PerUnit"
        )[0].id,
        frequency: "Annual",
      });
    }
  }

  // get annual rate plan: use promotion rate plan if present.
  getAnnualRatePlan(ratePlans) {
    const promotedPlan = ratePlans.find(
      (ratePlan) =>
        ratePlan.BillingFrequency__c === "Annual" &&
        ratePlan.name.includes("Promotion")
    );
    const baseAnnualPlan = ratePlans.find(
      (ratePlan) =>
        ratePlan.BillingFrequency__c === "Annual" &&
        !ratePlan.name.includes("Promotion")
    );
    return promotedPlan || baseAnnualPlan; // use promotion annual rate plan if present, otherwise use the default annual rate plan
  }

  checked(e, plan) {
    e.preventDefault();

    const ratePlanId = plan.id;
    const ratePlanChargeId = plan.productRatePlanCharges.filter(
      (element) => element.model === "PerUnit"
    )[0].id;

    let frequency;
    if (this.monthlyRatePlan.id === plan.id) {
      this.monthly = layout.active;
      this.annual = null;
      frequency = "Monthly";
    } else {
      this.monthly = null;
      this.annual = layout.active;
      frequency = "Annual";
    }
    this.props.setRateCheck(true);
    this.context.updateFormData({
      ratePlanId,
      ratePlanChargeId,
      frequency: frequency,
    });
  }

  render() {
    if (this.context.formData?.frequency === "Annual") {
      this.monthly = null;
      this.props.setRateCheck(true);
      this.annual = layout.active;
    } else if (this.context.formData?.frequency === "Monthly") {
      this.monthly = layout.active;
      this.props.setRateCheck(true);
      this.annual = null;
    }
    const monthPrice = `$${this.monthlyRatePlan?.price}`;
    const annualPrice = `$${this.annualRatePlan?.price}`;
    const annualBill = `Billed $${(
      this.annualRatePlan?.price * 12
    ).toLocaleString("en-US")} Annually`;
    const diff =
      this.monthlyRatePlan?.price * 12 - this.annualRatePlan?.price * 12;
    return (
      <Fragment>
        <div className={subscription["form-title-wrap"]}>
          <span className={subscription.number}>1</span>
          <h2 className={subscription["form-title"]}>
            Choose Subscription Cycle
          </h2>
        </div>
        <div className={subscription["mlr-30px"]}>
          <div className={`${layout.row} ${layout["flex-start"]}`}>
            <SubscriptionCard
              flag={this.monthly}
              cycle="Monthly"
              highliteStyle={subscription["text-black"]}
              price={monthPrice}
              billing="Billed Monthly"
              onClick={(e) => {
                e.preventDefault();
                this.checked(e, this.monthlyRatePlan);
              }}
            />

            <SubscriptionCard
              flag={this.annual}
              cycle="Annual"
              diff={diff}
              highliteStyle={subscription["text-highlight"]}
              price={annualPrice}
              billing={annualBill}
              onClick={(e) => {
                e.preventDefault();
                this.checked(e, this.annualRatePlan);
              }}
            />

            <VoiceUsageCard voiceUsage={this.props.voiceUsage} />
          </div>
        </div>
      </Fragment>
    );
  }
}
export default SubscriptionCycle;
