import logo from "../../../assets/ujet-logo.svg";
import style from "./navbar.module.scss";

const Navbar = ({}) => {
  return (
    <section className={style.navbar}>
      <nav className="container" role="navigation" aria-label="Main">
        <img
          className={style.logo}
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt="Ujet logo"
        />
        <div className={style.menu}>
          <div>Menu | Search</div>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
