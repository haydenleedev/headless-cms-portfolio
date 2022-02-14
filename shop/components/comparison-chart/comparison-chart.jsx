import { Component } from "react";
import Button from "../buttons/button";
import compare from "./comparison-chart.module.scss";
import * as svgComponent from "../icons";

class ComparisonChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      includesData: this.formatIncludesChartData(
        props.includedFeaturesChartData
      ),
      addOnsData: this.formatAddOnsChartData(props.addOnsChartData),
    };
  }

  formatIncludesChartData(data) {
    const formatted = {};
    Object.keys(data[0].includes).forEach((key) => {
      formatted[key] = [];
    });
    data.forEach((item) => {
      Object.entries(item.includes).map(([key, value]) => {
        formatted[key].push(value);
      });
    });
    return formatted;
  }

  formatAddOnsChartData(data) {
    const formatted = {};
    Object.keys(data[0].addOns).forEach((key) => {
      formatted[key] = [];
    });
    data.forEach((item) => {
      Object.entries(item.addOns).map(([key, value]) => {
        formatted[key].push(value);
      });
    });
    return formatted;
  }

  render() {
    return (
      <div className={compare["compare-table"]}>
        <div className={compare["compare-sticky"]}>
          <div className={compare["table-row"]}>
            <div
              className={`${compare["table-th"]} ${compare["table-header"]}`}
            >
              <p>Feature Breakdown</p>
            </div>
            <div className={compare["table-th"]}>
              <h3>Free</h3>
              <span>$0</span>
              <Button
                color="btn-blue"
                size="btn-small"
                text="Try Now"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.setFree(true);
                }}
              />
            </div>
            {this.props.data.map((product) => {
              const promoted = this.props.promotions.find(
                (promotion) =>
                  promotion && promotion.PlanType__c === product.PlanType__c
              );
              return (
                <div className={compare["table-th"]} key={product.primaryId}>
                  <h3>{product.packageName}</h3>
                  <div>
                    <span>${product.price}</span>

                    {/* {promoted && (
                  <span>${promoted.price}</span>
                )} */}
                    {/* <span
                  className={
                    promoted ? compare["priceStrikethrough"] : null
                  }
                >
                  ${this.props.data[0].price}
                </span> */}
                  </div>
                  <Button
                    color="btn-blue"
                    size="btn-small"
                    text="Buy Now"
                    onClick={(e) => {
                      e.preventDefault();
                      promoted
                        ? this.props.toggleSelected(promoted)
                        : this.props.toggleSelected(product);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Includes */}
        <div
          className={`${compare["table-row"]} ${compare.nowrap} ${compare["table-cat"]}`}
        >
          <div className={`${compare["table-th"]}`}>
            <h4>Includes</h4>
          </div>
        </div>
        <div className={compare["table-body"]}>
          {Object.keys(this.state.includesData).length > 0 &&
            Object.entries(this.state.includesData).map(
              ([key, value], index) => {
                return (
                  <div
                    className={compare["table-row"]}
                    key={"feature-includes" + index}
                  >
                    <div className={compare["table-td"]}>
                      <p>{key}</p>
                    </div>
                    {value.map((val, i) => {
                      return (
                        <div
                          className={compare["table-td"]}
                          key={"feature-includes-inner" + i}
                        >
                          {val === 1 && <svgComponent.IconCheck />}
                          {val === 0 && <svgComponent.IconX />}
                          {val !== 1 && val !== 0 && i !== 0 && (
                            <p className={compare["align-self-center"]}>
                              {val}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }
            )}
        </div>
        {/* Add Ons */}
        <div
          className={`${compare["table-row"]} ${compare.nowrap} ${compare["table-cat"]}`}
        >
          <div className={`${compare["table-th"]}`}>
            <h4>Add-Ons</h4>
          </div>
        </div>
        <div className={compare["table-body"]}>
          {Object.keys(this.state.addOnsData).length > 0 &&
            Object.entries(this.state.addOnsData).map(([key, value], index) => {
              return (
                <div
                  className={compare["table-row"]}
                  key={"add-on-includes" + index}
                >
                  <div className={compare["table-td"]}>
                    <p>{key}</p>
                  </div>
                  {value.map((val, i) => {
                    return (
                      <div
                        className={compare["table-td"]}
                        key={"add-on-includes-inner" + i}
                      >
                        {val === 1 && <svgComponent.IconCheck />}
                        {val === 0 && <svgComponent.IconX />}
                        {val !== 1 && val !== 0 && i !== 0 && (
                          <p className={compare["align-self-center"]}>{val}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default ComparisonChart;
