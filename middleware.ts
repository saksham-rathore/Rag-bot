import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const url = request.nextUrl;

  // If already signed in, redirect away from auth pages
  if (
    token &&
    (url.pathname.startsWith("/signIn") || url.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/Dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signIn", "/signup"],
};
