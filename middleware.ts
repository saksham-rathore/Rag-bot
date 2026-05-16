import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check NextAuth session cookie (works in Edge runtime without importing next-auth/jwt)
  const sessionToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  // If already signed in, redirect away from auth pages to Dashboard
  if (
    sessionToken &&
    (pathname.startsWith("/signIn") || pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/Dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signIn", "/signup"],
};