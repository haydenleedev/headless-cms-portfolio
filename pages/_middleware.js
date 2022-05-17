import { NextResponse } from "next/server";

export async function middleware(req) {
  // Have the uppercase redirect urls in an array, since redirecting all uppercase urls
  // is risky for assets such as fonts etc.
  const uppercaseRedirects = [
    "/archive/01June2019-website-privacy-notice",
    "/archive/01June2019-privacy-notice",
    "/archive/policy-prior-to-01-June-2019",
    "/CER"
  ];

  // Redirect uppercase urls to lowercase based on the array above
  if (
    uppercaseRedirects.includes(req.nextUrl.pathname)
  ) {
    return NextResponse.redirect(
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
      return NextResponse.redirect(`${redirectUrl}/${postSlug}`);
    }
    return NextResponse.redirect(redirectUrl);
  }
  // Redirect brand.ujet.cx
  const brandUrl = "brand.ujet.cx";
  if (url.includes(brandUrl)) {
    const redirectUrl = "https://ujet.cx/brand";
    return NextResponse.redirect(redirectUrl);
  }
  // Redirect buy.ujet.cx
  const buyUrl = "buy.ujet.cx";
  if (url.includes(buyUrl)) {
    const redirectUrl = "https://ujet.cx/shop";
    return NextResponse.redirect(redirectUrl);
  }

  // All other cases do nothing
  return NextResponse.next();
}