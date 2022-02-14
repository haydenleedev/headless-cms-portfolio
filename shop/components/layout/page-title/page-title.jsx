import { Component } from "react";
import layout from "../../../styles/layout.module.scss";

class PageTitle extends Component {
  render() {
    const pageTitle = this.props.title;

    return (
      <div className={`${layout["mb-20px"]} ${layout["align-center"]}`}>
        <h1 className={layout["page-title"]}>{pageTitle}</h1>
      </div>
    );
  }
}

export default PageTitle;
