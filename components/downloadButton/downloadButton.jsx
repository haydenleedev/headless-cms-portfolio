import { useEffect, useState } from "react";
import style from "./downloadButton.module.scss";

const DownloadButton = ({
  url,
  className,
  title,
  ariaLabel,
  onFocus,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState(null);
  useEffect(() => {
    let progressInterval;
    if (progress >= 100) {
      setDownloadMessage("Download Ready!");
      setTimeout(() => {
        setProgress(0);
        setDownloadMessage("Please check your 'Downloads' folder.");
        setTimeout(() => {
          setDownloadMessage(null);
        }, 2000);
      }, 2000);
      clearTimeout(progressInterval);
    } else if (progress > 0 && progress < 100) {
      progressInterval = setTimeout(() => {
        setProgress(progress + 10);
      }, 100);
    }
    return () => {
      clearTimeout(progressInterval);
    };
  }, [progress]);

  const downloadResource = () => {
    setProgress(0);
    setDownloadMessage("Please wait...");
    if (url) {
      const isMobile =
        /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|/i.test(
          navigator.userAgent
        );
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      if (isMobile) {
        link.download = true;
      }
      setLoading(true);
      setProgress(progress + 10);
      setTimeout(() => {
        setLoading(false);
        link.click();
      }, 1500);
    }
  };
  return (
    <div className={style.downloadButton}>
      <button
        className={className}
        onClick={downloadResource}
        disabled={loading}
        title={title}
        aria-label={ariaLabel}
        onFocus={onFocus}
      >
        {children}
      </button>
      {loading && (
        <div className={style.progress}>
          <div className="progress">
            <div
              className="progress--bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {downloadMessage && <p className={style.status}>{downloadMessage}</p>}
    </div>
  );
};

export default DownloadButton;
