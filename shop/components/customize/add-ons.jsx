import AddOnCard from "../cards/add-on-card";
import { Component } from "react";
import layout from "../../styles/layout.module.scss";
import customize from "./customize.module.scss";
import GlobalContext from "../../../context";
class Addons extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.checked = this.checked.bind(this);
    this.itemList = props.formData?.addOns || [];
    this.items = props.formData?.addOnsData || [];
  }

  checked(item) {
    const itemId = item.id;
    if (this.itemList.includes(itemId)) {
      this.itemList = this.itemList.filter((element) => element !== itemId);
      this.items = this.items.filter((element) => element.id !== itemId);
    } else {
      this.itemList.push(itemId);
      this.items.push(item);
    }
    this.context.updateFormData({
      addOns: this.itemList,
      addOnsData: this.items,
    });
  }

  render() {
    return (
      <div className={customize["mlr-30px"]}>
        {this.props.data && (
          <div className={layout.row}>
            {this.props.data.map((item, index) => {
              return (
                <div key={index} className={`${layout.col} ${layout["col-3"]}`}>
                  <AddOnCard
                    option={index + 1}
                    text={item.name}
                    check={this.context.formData?.addOns?.includes(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.checked(item);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
export default Addons;
