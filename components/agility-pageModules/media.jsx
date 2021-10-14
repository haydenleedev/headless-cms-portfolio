import { AgilityImage } from "@agility/nextjs";

const Media = ({ media }) => {
  //  TODO: Handle video rendering
  if (!media.url) return null;
  return (
    <AgilityImage
      src={media.url}
      alt={media.label}
      width={media.pixelWidth}
      height={media.pixelHeight}
    ></AgilityImage>
  );
};

export default Media;
