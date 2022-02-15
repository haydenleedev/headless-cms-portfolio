import { Component } from "react";
import * as svgComponent from "../icons";
import includes from "./features-include.module.scss";
import icons from "../buttons/buttons.module.scss";

class ProductFeaturesAddons extends Component {
  render() {
    return (
      <div
        id="addons-basic"
        className={`${includes.feature} ${includes.addons}`}
      >
        <p className={includes["feature-header"]}>Optional Add-Ons:</p>
        <ul className={includes["feature-list"]}>
          {this.props.addOns.length > 0 ? (
            this.props.addOns.map((item, index) => {
              return (
                <li key={index}>
                  <svgComponent.IconCheck />
                  <span>{item.name}</span>
                  {item.tooltip && (
                    <span className={icons["tooltip-wrap"]}>
                      <span className={icons.tooltip}>{item.tooltip}</span>
                    </span>
                  )}
                </li>
              );
            })
          ) : (
            <li>
              <span>All available Add-Ons are included in this package.</span>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default ProductFeaturesAddons;
