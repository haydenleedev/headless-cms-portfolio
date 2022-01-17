import { NextResponse } from "next/server";

export async function middleware(req) {

  // // Handle URL's that contain uppercase characters
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) 
    return NextResponse.redirect(`${req.nextUrl.origin}${req.nextUrl.pathname.toLowerCase()}`);

  let url = req.url;
  url = url.replace(/en-US/g, "");
  // if (url.toLowerCase() !== url) return NextResponse.redirect(url.toLowerCase());
  
  // Handle blog.ujet.co redirects to ujet.cx/blog/postname
  const blogUrl = "blog.ujet.co";
  const blogUrlRegex = new RegExp(`/(${blogUrl})/`);
  if (url.includes(blogUrl)) {
    const postSlug = url.split(blogUrlRegex)[2];
    const redirectUrl = "https://ujet.cx/blog";
    if (postSlug) {
      return NextResponse.redirect(`${redirectUrl}/${postSlug}`);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // All other cases do nothing.
  return NextResponse.next();
}
