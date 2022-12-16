import dynamic from "next/dynamic";
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: true });

const FirstFoldLink = ({ fields, primary }) => {
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
