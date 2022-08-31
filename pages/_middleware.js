import { NextResponse } from "next/server";
import marketoRedirects from "../data/marketoRedirects.json";
import marketoLpRedirects from "../data/marketoLpRedirects.json";
import marketoEmailRedirects from "../data/marketoEmailRedirects.json";

export async function middleware(req) {
  // Have the uppercase redirect urls in an array, since redirecting all uppercase urls
  // is risky for assets such as fonts etc.
  const uppercaseRedirects = [
    "/archive/01June2019-website-privacy-notice",
    "/archive/01June2019-privacy-notice",
    "/archive/policy-prior-to-01-June-2019",
    "/CER",
    "/resources/videos/level-up-your-CX-vid-lp",
  ];

  const clientIPCookieName = "client_ip";
  const clientCountryCookieName = "client_country";

  const redirectWithCookies = (url) => {
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.cookie(clientIPCookieName, req.ip);
    redirectResponse.cookie(clientCountryCookieName, req.geo.country);
    return redirectResponse;
  };

  console.log(req.nextUrl.pathname);

  const getCorrectMarketoUrlCase = (redirects) => {
    for (let i = 0; i < redirects.length; i++) {
      if (
        redirects[i].source.toLowerCase().replaceAll("\\\\", "") ===
        req.nextUrl.pathname.toLowerCase()
      ) {
        return `${req.nextUrl.origin}${redirects[i].source.replaceAll(
          "\\\\",
          ""
        )}`;
      }
    }
    return null;
  };

  const marketoRedirUrl = getCorrectMarketoUrlCase(marketoRedirects);
  const marketoLpRedirUrl = getCorrectMarketoUrlCase(marketoLpRedirects);
  const marketoEmailRedirUrl = getCorrectMarketoUrlCase(marketoEmailRedirects);
  if (marketoRedirUrl) {
    return redirectWithCookies(marketoRedirUrl);
  } else if (marketoLpRedirUrl) {
    return redirectWithCookies(marketoLpRedirUrl);
  } else if (marketoEmailRedirUrl) {
    return redirectWithCookies(marketoEmailRedirUrl);
  }

  // Redirect uppercase urls to lowercase based on the array above
  // Content item uppercase urls are also redirected
  if (
    uppercaseRedirects.includes(req.nextUrl.pathname) ||
    (req.nextUrl.pathname.match(
      /\/resources\/|\/blog\/|\/press-releases\/|\/channel\/|\/deal-registration\/|\/integrations\//
    ) &&
      req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase())
  ) {
    return redirectWithCookies(
      `${req.nextUrl.origin}${req.nextUrl.pathname.toLowerCase()}`
    );
  }

  const url = req.url;

  // Redirect blog.ujet.co
  const blogUrl = "blog.ujet.co";
  const blogUrlRegex = new RegExp(`/(${blogUrl})/`);

  if (url.includes(blogUrl)) {
    const postSlug = url.replace(/en-US/g, "").split(blogUrlRegex)[2];
    const redirectUrl = "https://ujet.cx/blog";
    if (postSlug) {
      return redirectWithCookies(`${redirectUrl}/${postSlug}`);
    }
    return redirectWithCookies(redirectUrl);
  }

  // Redirect buy.ujet.cx
  const buyUrl = "buy.ujet.cx";
  if (url.includes(buyUrl)) {
    const redirectUrl = "https://ujet.cx/shop";
    return redirectWithCookies(redirectUrl);
  }

  // Redirect brand.ujet.cx
  const brandUrl = "brand.ujet.cx";
  const brandUrlRegex = new RegExp(`/(${brandUrl})/`);

  if (url.includes(brandUrl)) {
    const postSlug = url.replace(/en-US/g, "").split(brandUrlRegex)[2];
    const redirectUrl = "https://ujet.cx/brand";
    if (postSlug) {
      return redirectWithCookies(`${redirectUrl}/${postSlug}`);
    }
    return redirectWithCookies(redirectUrl);
  }

  // All other cases do nothing
  const response = NextResponse.next();
  response.cookie(clientIPCookieName, req.ip);
  response.cookie(clientCountryCookieName, req.geo.country);
  return response;
}
