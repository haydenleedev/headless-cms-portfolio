import dynamic from "next/dynamic";
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });

const FirstFoldLink = ({ fields, primary }) => {
  const linksStyle = fields?.linksStyle || "button";
  const getLinksStyle = () => {
    switch (linksStyle) {
      case "textWithArrow":
        return "chevron-after w-600 mt-2";
      case "buttonNavy":
        return "button navy mt-2";
      case "buttonOrange":
        return "button orange mt-2";
      default:
        return "button cyan outlined mt-2";
    }
  };
  const link = primary ? fields.primaryLink : fields.secondaryLink;
  return link?.href && link?.text ? (
    <div className={style.linkWrapper}>
      <AgilityLink
        agilityLink={link}
        className={`${getLinksStyle()} ${
          primary ? `${style.primaryLink}` : style.secondaryLink
        } ${fields.linkClasses ? fields.linkClasses : ""} ${style[linksStyle]}`}
        ariaLabel={`Navigate to page ` + link.href}
        title={`Navigate to page ` + link.href}
      >
        {link.text}
      </AgilityLink>
    </div>
  ) : null;
};

export default FirstFoldLink;
