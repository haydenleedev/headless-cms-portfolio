import style from "./message.module.scss";
import Link from "next/link";

const Message = ({}) => {
  return (
    <section className={style.message}>
      <div className={`container ${style.messageContainer}`}>
        <Link href="#">
          <a className="button small">A button</a>
        </Link>
        <div>
          <p>Message</p>
        </div>
      </div>
    </section>
  );
};

export default Message;
