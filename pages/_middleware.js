import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.url;
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
  return NextResponse.next();
}
