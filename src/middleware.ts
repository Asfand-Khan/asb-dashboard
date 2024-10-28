import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const protectedRoutes = ["/", "/case-study/add", "/hero/add", "/our-mission/add", "/reviews/add", "/services/add", "/service-page/content", "/service-page/our-process", "/forms/:path*"];
  const pathname = request.nextUrl.pathname;

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/case-study/add", "/hero/add", "/our-mission/add", "/reviews/add", "/services/add", "/service-page/content", "/service-page/our-process", "/forms/:path*"],
};
