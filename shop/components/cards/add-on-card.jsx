import { Component } from "react";
import addOn from "./add-on-card.module.scss";

class AddOnCard extends Component {
  render() {
    return (
      <>
        <div className={addOn["input-card"]}>
          <label htmlFor={this.props.option}>
            <input
              id={this.props.option}
              name={this.props.option}
              onChange={this.props.onChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") this.props.onChange(e);
              }}
              type="checkbox"
              checked={this.props.check || false}
            />
            <div className={addOn["input-focus"]}></div>
            <p>{this.props.text.split(":")[1]}</p>
          </label>
        </div>
      </>
    );
  }
}

export default AddOnCard;
