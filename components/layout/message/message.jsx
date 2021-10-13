import style from "./message.module.scss";
import Link from "next/link";
import { useState } from "react";

const Message = ({}) => {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  return (
    <section className={style.message}>
      <nav className="container" role="navigation" aria-label="Contact UJET">
        <div className={style.demo}>
          <Link href="#">
            <a className="button small white" aria-label="Request a demo from UJET">
              Request a demo
            </a>
          </Link>
        </div>
        <div className={style.contact}>
          <Link href="#">
            <a aria-label="Contact UJET">
              <b>Contact us</b>
            </a>
          </Link>
          <a href="tel:" aria-label="Call UJET" className={style.phone}>
            <span>ICON </span>1-123-123-12333
          </a>
        </div>
        <div className={style.close}>
          <a
            aria-labe="Close contact navigation"
            onClick={() => {
              setOpen(false);
            }}
          >
            X
          </a>
        </div>
      </nav>
    </section>
  );
};

export default Message;
