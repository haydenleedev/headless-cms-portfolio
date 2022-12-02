import dynamic from "next/dynamic";
import style from "./resourceDownload.module.scss";
import Image from "next/image";
const Media = dynamic(() => import("../media"), { ssr: false });
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });
const ResourceDownloadContent = ({ resourceDownload }) => {
  return (
    <section className="section">
      <div className="container">
        <div className={`${style.columns} max-width-narrow mr-auto ml-auto`}>
          <div
            className={`${resourceDownload.formBackgroundColor || ""} ${
              style.form
            }`}
          >
            <h1 className="heading-5 mb-3">
              {resourceDownload?.title || "Download Resource"}
            </h1>

            <div className={style.thumbnailWrap}>
              {/\S/.test(resourceDownload.formTitle) && (
                <h2
                  className={`${style.formTitle} heading-6 d-flex align-items-center`}
                >
                  <Image src="/download.svg" width={60} height={60} />

                  <span className="pl-2 d-flex text-20px text-darkblue w-600 line-height-1-2">
                    {" "}
                    {resourceDownload.formTitle ||
                      "Please click to download the resource today!"}
                  </span>
                </h2>
              )}
              {resourceDownload.link?.href && (
                <AgilityLink
                  className="imgLink"
                  agilityLink={resourceDownload.link}
                >
                  <div className={`${style.thumbnail}`}>
                    <Media
                      media={resourceDownload.image}
                      title={resourceDownload.title}
                    />
                    <span className={style.download}>Download</span>
                  </div>
                </AgilityLink>
              )}
              {resourceDownload.link?.href && resourceDownload.link?.text && (
                <div className={`mt-3 align-center ${style.thumbnailButton}`}>
                  <AgilityLink
                    className={`button navy ${style.mainButton}`}
                    agilityLink={resourceDownload.link}
                  >
                    {resourceDownload.link.text}
                  </AgilityLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceDownloadContent;
