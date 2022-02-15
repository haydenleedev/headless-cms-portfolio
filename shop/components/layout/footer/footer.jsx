import { Component } from "react";
import Link from "next/link";
import Logo from "../../icons/UjetCxLogo";
import style from "./footer.module.scss";

class FooterMenu extends Component {
  render() {
    const footerMenue = this.props.footerMenu;
    const menue = this.props.menu;

    return (
      <footer className={style.footer}>
        <div className={style.container}>
          <div className={`${style.footNote}`}>
            <div className={`${style.cookies}`}>
              <Logo color="#ffffff" />
            </div>
            <div className={style.footNoteLinks}>
              <p className={style.footNoteLink}>
                © UJET INC., 2022 All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default FooterMenu;
