import { Component, Fragment } from "react";
import Link from "next/link";
import styles from "./packages.module.scss";

class PackageTitles extends Component {
  render() {
    const productId = this.props.productId;
    return (
      <Fragment>
        <h2 className={styles["card-title"]}>{this.props.title}</h2>
        <p className={`${styles.pricing} ${styles["pb-20px"]}`}>
          {this.props.price}
          <span className={styles["small-text"]}>/mo</span>
        </p>
      </Fragment>
    );
  }
}

export default PackageTitles;
