import { AgilityImage } from "@agility/nextjs";

const Media = ({ media, title }) => {
  const isBrowser = typeof window !== "undefined";
  if (!media?.url) return null;
  else {
    let mediaName = media.url.split("/");
    mediaName = mediaName[mediaName.length - 1];
    const imageFileRegex = /.*\.(jpe?g|png|svg|gif)$/;
    const mediaType = mediaName.split(".")[1];

    switch (imageFileRegex.test(mediaName)) {
      case true:
        return (
          <AgilityImage
            src={media.url}
            alt={media.label || ""}
            width={media.pixelWidth != "0" ? media.pixelWidth + "px" : "360"}
            height={media.pixelHeight}
            title={title ? title : ""}
            // Does not work well...
            // layout="responsive"
          ></AgilityImage>
        );
      default:
        return (
          <video
            className="video"
            autoPlay
            muted
            loop
            controls
            aria-label={media.label || ""}
          >
            <source src={media.url} type={`video/${mediaType}`} />
            Your browser does not support the video tag.
          </video>
        );
    }
  }
};

export default Media;
