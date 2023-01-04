import dynamic from "next/dynamic";
import style from "./resourceDownload.module.scss";
import { useContext } from "react";
import GlobalContext from "../../../context";
import Image from "next/image";
const Media = dynamic(() => import("../media"));
const AgilityLink = dynamic(() => import("../../agilityLink"));

const ResourceDownloadContent = ({ dynamicPageItem, customData }) => {
  const resourceDownloadContent = dynamicPageItem.fields;

  const { campaignScriptIDRef } = useContext(GlobalContext);

  return (
    <>
      {
        <>
          <section className="section">
            <div className="container">
              <div
                className={`${style.columns} max-width-narrow mr-auto ml-auto`}
              >
                <div
                  className={`${resourceDownloadContent.formBackgroundColor} ${style.form}`}
                >
                  {resourceDownloadContent.title && (
                    <h1 className="heading-5 mb-3">
                      {resourceDownloadContent.title}
                    </h1>
                  )}

                  <div className={style.thumbnailWrap}>
                    {/\S/.test(resourceDownloadContent.downloadHeader) && (
                      <h2
                        className={`${style.formTitle} heading-6 d-flex align-items-center`}
                      >
                        <Image src="/download.svg" width={60} height={60} />

                        <span className="pl-2 d-flex text-20px text-darkblue w-600 line-height-1-2">
                          {" "}
                          {resourceDownloadContent.downloadHeader ||
                            "Please click to download the resource today!"}
                        </span>
                      </h2>
                    )}
                    {resourceDownloadContent.downloadLink?.href && (
                      <AgilityLink
                        className="imgLink"
                        agilityLink={resourceDownloadContent.downloadLink}
                      >
                        <div className={`${style.thumbnail}`}>
                          <Media
                            media={resourceDownloadContent.downloadImage}
                            title={resourceDownloadContent.title}
                          />
                          <span className={style.download}>Download</span>
                        </div>
                      </AgilityLink>
                    )}
                    {resourceDownloadContent.downloadLink?.href &&
                      resourceDownloadContent.downloadLink?.text && (
                        <div
                          className={`mt-3 align-center ${style.thumbnailButton}`}
                        >
                          <AgilityLink
                            className="button navy"
                            agilityLink={resourceDownloadContent.downloadLink}
                          >
                            {resourceDownloadContent.downloadLink.text}
                          </AgilityLink>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    </>
  );
};

export default ResourceDownloadContent;
