import Link from "next/link";
import { Component } from "react";
import nav from "../navigation-menu/nav.module.scss";
import bar from "./progress-bar.module.scss";
import ProgressBar from "./progress-bar";

class NavigationStep extends Component {
  render() {
    return (
      <header className={bar["head-wrap"]}>
        <div className={`${bar["progress-bar"]} ${nav["sticky-wrap"]}`}>
          <ul className={nav.menu}>
            <li className={nav.logo}>
              <Link
                href="https://ujet.cx"
                passHref
                tabIndex={0}
                aria-label="Navigate to UJET's home page"
              >
                UJET.cx, the world’s first and only CCaaS 3.0 cloud contact
                center provider.
              </Link>
            </li>
          </ul>
          <ProgressBar
            progress={this.props.progress}
            freeFlow={this.props.freeFlow}
          />
        </div>
      </header>
    );
  }
}

export default NavigationStep;
