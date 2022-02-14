import AddOnCard from "../cards/add-on-card";
import modal from "./modal.module.scss";
import { Component } from "react";
import ButtonFooter from "../buttons/add-on-button-footer";
import customize from "../customize/customize.module.scss";
import withRouter from "next/dist/client/with-router";
import GlobalContext from "../../../context";

export default withRouter(
  class AddOnModal extends Component {
    static contextType = GlobalContext;
    constructor(props) {
      super(props);
      this.checked = this.checked.bind(this);
      this.goToConfigure = this.goToConfigure.bind(this);
      this.state = {
        itemLength: 0,
      };
      this.itemList = [];
    }

    goToConfigure(e) {
      e.preventDefault();
      this.context.updateFormData({ noAddOn: false });
      document.body.className = null;
      this.props.setModal(false);
    }

    checked(item) {
      const itemId = item.id;
      if (this.itemList.includes(itemId)) {
        this.itemList = this.itemList.filter((element) => element !== itemId);
      } else {
        this.itemList.push(itemId);
        this.setState({ itemLength: this.itemList.length });
      }

      if (this.itemList.length == 0) {
        this.setState({ itemLength: 0 });
      }

      this.context.updateFormData({
        addOns: this.itemList,
        addOnsData: this.props.data.filter((addOn) =>
          this.itemList.find((id) => id === addOn.id)
        ),
      });
    }

    render() {
      return (
        <div className={modal.modal}>
          <p className={`${modal["section-title"]} ${modal["col-3"]}`}>
            Interested in Add-Ons?
            <button
              className={modal.close}
              type="button"
              onClick={(e) => {
                this.goToConfigure(e);
              }}
            >
              <span className={modal.visuallyhidden}>Cancel</span>
            </button>
          </p>

          <div className={`${customize["mlr-30px"]} ${customize["flex"]}`}>
            {this.props.data && (
              <div className={modal.row}>
                {this.props.data.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`${modal.col} ${modal["col-3"]}`}
                    >
                      <AddOnCard
                        option={index + item.name}
                        text={item.name}
                        onChange={(e) => {
                          e.stopPropagation();
                          this.checked(item);
                        }}
                        check={this.itemList?.includes(item.id)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <ButtonFooter
            itemLength={this.state.itemLength}
            nextStep={`/subscription-cycle/${this.context.formData?.primaryId}`}
            prevStep={`/subscription-cycle/${this.context.formData?.primaryId}`}
          />
        </div>
      );
    }
  }
);
