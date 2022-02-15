import { Component } from "react";
import * as svgComponent from "../icons";
import includes from "./features-include.module.scss";
import icons from "../buttons/buttons.module.scss";

class ProductFeaturesIncludes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.product.packageName,
      includes: props.product.includes.reverse(),
      title: props.product.packageFeaturesAlsoIncluded
        ? `Includes ${props.product.packageFeaturesAlsoIncluded} Plus`
        : "Includes",
    };
  }

  render() {
    return (
      <div id="feature-basic" className={includes.feature2}>
        <p className={includes["feature-header"]}>{this.state.title}</p>
        <ul className={includes["feature-list"]}>
          {this.state.includes.length > 0 &&
            this.state.includes.map((item, index) => {
              return (
                <li key={index}>
                  <svgComponent.IconCheck />
                  <span>{item.fields.name}</span>
                  {item.fields.description && (
                    <span className={icons["tooltip-wrap"]}>
                      <span className={icons.tooltip}>
                        {item.fields.description}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default ProductFeaturesIncludes;
