import { Component } from "react";
import implementation from "./implementation.module.scss";
import layout from "../../styles/layout.module.scss";

class ImplementationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      includes: props.includes,
    };
  }
  render() {
    return (
      <div className={`${layout.col} ${layout["col-2"]}`}>
        <div
          tabIndex={0}
          onClick={this.props.onClick}
          role="button"
          aria-label={`Select ${this.props.title} as the implementation service`}
          onKeyPress={(e) => {
            if (e.key === "Enter") this.props.onClick(e);
          }}
          className={`${layout.inner} ${layout["plr-0"]} ${implementation["select-box"]} ${this.props.disabled}`}
        >
          <p className={implementation.hidden}>
            Choose your UJET package implementation cycle
          </p>

          <div className={`${layout["plr-20px"]} ${layout.flex}`}>
            <div className={implementation.radio}>
              <div className={`${implementation["radio-wrap"]}`}>
                <span
                  className={`${implementation["radio-inner"]} ${this.props.selected}`}
                ></span>
              </div>
            </div>
            <div>
              <h3 className={implementation["radio-title"]}>
                {this.props.title}
              </h3>
              <p className={implementation["text-large"]}>
                ${this.props.price.toLocaleString("en-US")}
                <span className={implementation["text-suffix"]}></span>
              </p>
            </div>
          </div>

          {this.props.title === "SMB+" && (
            <div className={implementation["tag"]}>
              <span>Great for small businesses</span>
            </div>
          )}

          {this.props.title === "Premier" && (
            <div className={implementation["tag"]}>
              <span>Great for enterprise businesses</span>
            </div>
          )}

          <div className={`${layout["plr-20px"]}`}>
            <h4 className={layout["pt-20px"]}>Includes:</h4>
            <ul
              className={`${layout.bullets} ${implementation["text-medium"]}`}
            >
              {this.state.includes.length > 0 &&
                this.state.includes.map((item, index) => {
                  return <li key={index}>{item.fields.name}</li>;
                })}
            </ul>

            {/** 
            <h4 className={layout['pt-20px']}>Add-Ons:</h4>
            <ul
              className={`${layout.bullets} ${implementation['text-medium']}`}
            >
              {this.props.addOns.length > 0 &&
                this.props.addOns.map((item, index) => {
                  return <li key={index}>{item.fields.name}</li>;
                })}
            </ul>
              **/}
          </div>
        </div>
      </div>
    );
  }
}
export default ImplementationCard;
