import Link from "next/link";
import { hrefSelf } from "../utils/validation";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const href = agilityLink?.href;
  if (!href)
    throw new Error(
      "AgilityLink: agilityLink prop must include a property called href!"
    );
  const isInner = hrefSelf(href);
  const rel = isInner ? null : "noindex noreferrer nofollow";
  const target = isInner ? "_self" : "_blank";
  return href ? (
    <Link
      href={href}
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
      >
        {children}
      </a>
    </Link>
  ) : null;
};

export default AgilityLink;
