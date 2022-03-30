import { Component, Fragment } from "react";
import GlobalContext from "../../../context";
import layout from "../../styles/layout.module.scss";
import BasicImplementation from "./basic-implementation";
import ImplementationCard from "./implementation-card";
import implementation from "./implementation.module.scss";

class Implementation extends Component {
  static contextType = GlobalContext;
  constructor(props, context) {
    super(props);

    let selected;
    if (context.formData.implementationId == null) {
      context.updateFormData({
        implementationId: props.data[2].productRatePlans[0].id,
      });
      selected = 2;
    } else {
      props.data.forEach((element, index) => {
        if (
          element.productRatePlans[0].id == context.formData.implementationId
        ) {
          selected = index;
        }
      });
    }

    this.state = {
      isActive: selected,
      implementations: props.data.filter(
        (implementation) => implementation.implementationName !== "Starter"
      ),
      starter: props.data.find(
        (implementation) => implementation.implementationName === "Starter"
      ),
    };
  }

  checked(index, id) {
    if (this.context.formData.implementationId == id) {
      this.setState({ isActive: null });
      this.context.updateFormData({ implementationId: null });
      this.props.setPageCheck(true);
    } else {
      this.setState({ isActive: index });
      this.context.updateFormData({ implementationId: id });
      this.props.setPageCheck(false);
    }
  }

  render() {
    return (
      <Fragment>
        <div className={implementation["form-title-wrap"]}>
          <span className={implementation.number}>2</span>
          <h2 className={implementation["form-title"]}>
            Implementation Services
          </h2>
        </div>
        <div className={implementation["mlr-30px"]}>
          <div className={layout.row}>
            <BasicImplementation
              data={this.state.starter}
              onChange={(e) => {
                e.stopPropagation();
                this.checked(2, this.state.starter.productRatePlans[0].id);
              }}
              selected={this.state.isActive === 2 ? "checked" : "unchecked"}
            />
          </div>
          <div className={layout.row}>
            {this.props.implementationsData &&
              this.state.implementations.map((item, index) => {
                const price =
                  item.productRatePlans[0].productRatePlanCharges[0].pricing[0]
                    .price;
                const includes = this.props.implementationsData.find(
                  (entry) => entry.fields.name === item.implementationName
                );
                return (
                  <ImplementationCard
                    key={index}
                    title={item.name.split(" ")[2]}
                    price={price}
                    includes={includes.fields.includedFeatures}
                    addOns={includes.fields.includedAddOns}
                    selected={
                      this.state.isActive === index ? implementation.active : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      this.checked(index, item.productRatePlans[0].id);
                    }}
                  />
                );
              })}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default Implementation;
