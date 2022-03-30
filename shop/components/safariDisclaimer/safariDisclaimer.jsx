import style from "./safariDisclaimer.module.scss";

const SafariDisclaimer = ({ currentVersion, required, link, message }) => {
  return (
    <div className="container">
      <div className={style.safariDisclaimer}>
        <p className="heading-5 w-600 mb-1">
          Please update your Safari browser
        </p>
        <p>Your Safari version: {currentVersion}</p>
        <p>Required Safari version: {required} (or higher)</p>
        <p className={style.message}>{message}</p>
        <a
          className={style.link}
          href={link}
          target="_blank"
          rel="noindex noreferrer nofollow"
        >
          {link}
        </a>
      </div>
    </div>
  );
};

export default SafariDisclaimer;
