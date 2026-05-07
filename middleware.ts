import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  if (token && (
    url.pathname.startsWith('/signIn') ||
    url.pathname.startsWith('/signUp')
  )) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
}

export const config = {
  matcher: [
    '/signIn',
    '/signUp',
  ],
}
