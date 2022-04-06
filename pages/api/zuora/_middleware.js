import { NextResponse } from "next/server";

export async function middleware(req) {

  const key = req.headers.get("apikey");

  if (key !== process.env.MIDDLEWARE_API_KEY) {
    return new Response(JSON.stringify({ message: "Not authenticated." }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}
