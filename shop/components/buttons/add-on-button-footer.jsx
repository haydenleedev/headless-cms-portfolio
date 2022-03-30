import withRouter from "next/dist/client/with-router";
import { Component } from "react";
import layout from "../../styles/layout.module.scss";
import Modal from "../modals/add-on-modal";
import Button from "./button";
import button from "./buttons.module.scss";

export default withRouter(
  class ButtonFooter extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showModal: false,
      };
      this.disable = true;
      this.showModal = this.showModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.onConfirm = this.onConfirm.bind(this);
      this.onCancel = this.onCancel.bind(this);
    }

    showModal() {
      this.props.router.push(this.props.nextStep);
      this.setState({ showModal: true });
    }

    closeModal() {
      this.props.router.push(this.props.prevStep);
      this.setState({ showModal: false });
    }

    onConfirm() {
      this.setState({ showModal: false });
      this.props.router.push(this.props.nextStep);
    }

    onCancel() {
      this.setState({ showModal: false });
    }

    componentDidUpdate() {
      if (this.props.itemLength > 0) {
        this.disable = false;
      } else {
        this.disable = true;
      }
    }
    render() {
      if (this.props.itemLength > 0) {
        this.disable = false;
      } else {
        this.disable = true;
      }
      return (
        <div
          className={`${button["modal-footer-btn-theme"]} ${layout["theme-padding"]}`}
          ref={(node) => {
            this.node = node;
          }}
        >
          <div
            className={`${layout.container} ${layout.grid} ${layout["align-center"]}`}
          >
            <div className={`${layout.row} ${layout["justify-center"]}`}>
              {this.props.itemLength > 0 ? (
                <Button
                  color="btn-orange"
                  size="btn-big"
                  text="Next"
                  disable={this.disable}
                  onClick={this.onConfirm}
                />
              ) : (
                <Button
                  color="btn-white"
                  size="btn-big"
                  text="Skip This Step"
                  onClick={this.closeModal}
                />
              )}
            </div>
          </div>
          {this.state.showModal ? (
            <Modal
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
              onClose={this.closeModal}
            />
          ) : (
            <></>
          )}
        </div>
      );
    }
  }
);
