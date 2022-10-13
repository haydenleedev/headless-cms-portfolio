import Link from "next/link";
import { checkForResourceURL, hrefSelf } from "../utils/validation";
import DownloadButton from "./downloadButton/downloadButton";

// use this component instead of directly using next/link / a tag combo WHEN a link from Agility is passed!!
// determines whether a link from agility is inner or outer
/*
as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
        onMouseEnter?: React.MouseEventHandler<Element> | undefined;
    onClick: React.MouseEventHandler;
    href?: string | undefined;
    ref?: any;
*/
function sanitizeHref(href) {
  return href.replace(/\/$/, "");
}

const AgilityLink = ({
  agilityLink, // the URL object from agility
  // passed to the inner a tag:
  className,
  title,
  ariaLabel,
  onFocus,
  // props passed to next/link below
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  // child components
  children,
  smooth = false,
}) => {
  const href = agilityLink?.href;
  if (!href)
    throw new Error(
      "AgilityLink: agilityLink prop must include a property called href!"
    );
  const isResource = checkForResourceURL(href);
  const isInner = hrefSelf(href);
  const rel = isInner ? null : "noindex noreferrer nofollow";
  const target = isInner ? "_self" : "_blank";
  return href ? (
    <Link
      href={sanitizeHref(href)}
      as={as}
      passHref={passHref}
      locale={locale}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <a
        className={className}
        title={title}
        aria-label={ariaLabel}
        rel={rel}
        target={target}
        onFocus={onFocus}
        onClick={(e) => {
          const sanitizedHref = sanitizeHref(href);
          if (sanitizedHref.includes("#")) {
            let hash;
            if (sanitizedHref[0] == "#") {
              hash = sanitizedHref;
            } else if (sanitizedHref[0] == "/") {
              hash = `#${sanitizedHref.split("#")[1]}`;
            }
            e.preventDefault();
            // Reset the hash to allow anchor links to work more than once
            if (window.location.hash) {
              window.location.hash = "";
            }
            window.location.hash = hash;
          }
        }}
      >
        {children}
      </a>
    </Link>
  ) : null;
};

export default AgilityLink;
