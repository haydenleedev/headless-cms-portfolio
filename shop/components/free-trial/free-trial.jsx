import { Component } from "react";
import icons from "../buttons/buttons.module.scss";
import includes from "../packages/features-include.module.scss";
import free from "./free-trial.module.scss";

class FreeTrial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      includes: props.freeProduct.includes,
    };
  }
  render() {
    return (
      <div className={`${includes.feature} ${free["mb-20px"]}`}>
        <h2 className={free.title}>Try UJET for Free!</h2>
        <ul className={`${includes["feature-list"]} ${free["grid-row-3"]}`}>
          {this.state.includes.length > 0 &&
            this.state.includes.map((item, index) => {
              return (
                <li key={index}>
                  {item.fields.name}
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

export default FreeTrial;
