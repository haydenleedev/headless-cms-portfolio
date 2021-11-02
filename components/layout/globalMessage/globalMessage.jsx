import style from "./globalMessage.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { boolean } from "../../../utils/validation";
import { renderHTML } from "@agility/nextjs";
import { getCookie } from "../../../utils/cookies";

const GlobalMessage = ({ globalData }) => {
  const { globalMessage } = globalData.globalMessage;
  console.log(globalMessage);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    const cookie = getCookie("globalMessage");
    if (cookie && cookie == "dismissed") {
      setOpen(false);
    }
  }, []);

  if (boolean(globalMessage.fields.disabled) || !open)
    return null;

  function dismissMessage() {
    document.cookie = "globalMessage=dismissed; max-age=172800";
    setOpen(false);
  }
  return (
    <section className={style.message}>
      <nav className="container" role="navigation">
        {globalMessage.fields.primaryLink.href &&
          !globalMessage.fields.content && (
            <div className={style.demo}>
              <Link href={globalMessage.fields.primaryLink.href}>
                <a
                  className="button small white"
                  aria-label={globalMessage.fields.primaryLink.text}
                  title={globalMessage.fields.primaryLink.text}
                >
                  {globalMessage.fields.primaryLink.text || "Request a demo"}
                </a>
              </Link>
            </div>
          )}
        {boolean(globalMessage.fields.showContactInfo) &&
          !globalMessage.fields.content && (
            <div className={style.contact}>
              <b>Contact us</b>
              <a href="tel:" aria-label="Call UJET" className={style.phone}>
                <span>ICON </span>1-123-123-12333
              </a>
            </div>
          )}
        {globalMessage.fields.content && (
          <small
            className={`content ${style.messageContent}`}
            dangerouslySetInnerHTML={renderHTML(globalMessage.fields.content)}
          />
        )}
        <div className={style.close}>
          <a
            aria-label="Close global message"
            title="Close global message"
            onClick={() => {
              dismissMessage();
            }}
          ></a>
        </div>
      </nav>
    </section>
  );
};

GlobalMessage.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let contentItem = null;

  try {
    let globalMessage = await api.getContentList({
      referenceName: "globalMessage",
      languageCode: languageCode,
      take: 1,
      contentLinkDepth: 4,
    });
    if (
      globalMessage &&
      globalMessage.items &&
      globalMessage.items.length > 0
    ) {
      contentItem = globalMessage.items[0];
    } else {
      return null;
    }
  } catch (error) {
    if (console)
      console.error("Could not load site navbar configuration.", error);
    return null;
  }
  // return clean object...
  return {
    globalMessage: contentItem,
  };
};

export default GlobalMessage;
