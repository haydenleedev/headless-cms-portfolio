import { AgilityImage } from "@agility/nextjs";

const Media = ({ media }) => {
  const isBrowser = typeof window !== "undefined";
  if (!media.url) return null;
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
            alt={media.label}
            width={media.pixelWidth != "0" ? media.pixelWidth : "360"}
            height={media.pixelHeight}
          ></AgilityImage>
        );
      default:
        return (
          <video className="video" autoPlay muted loop>
            <source src={media.url} type={`video/${mediaType}`} />
            Your browser does not support the video tag.
          </video>
        );
    }
  }
};

export default Media;
