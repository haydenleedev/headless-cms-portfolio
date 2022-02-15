import { Component } from "react";
import addOnCard from "./add-on-card.module.scss";

class CheckAddOnCard extends Component {
  render() {
    return (
      <>
        <div className={`${addOnCard.card}`}>
          <input type="checkbox" /> Add on 1
        </div>
      </>
    );
  }
}

export default CheckAddOnCard;
