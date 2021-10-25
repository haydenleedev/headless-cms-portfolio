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
            width={media.pixelWidth}
            height={media.pixelHeight}
          ></AgilityImage>
        );
      default:
        return (
          <video width="500" height="500" autoPlay muted loop>
            <source src={media.url} type={`video/${mediaType}`} />
            Your browser does not support the video tag.
          </video>
        );
    }
  }
};

export default Media;
