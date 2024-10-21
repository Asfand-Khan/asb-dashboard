import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    console.log("middleware")
  const token = request.cookies.get('token'); // Get the token from cookies

  // Check if the user is trying to access a protected route
  const protectedRoutes = ['/', '/profile'];
  const pathname = request.nextUrl.pathname;

  // If the token is not present and the user is trying to access a protected route
  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
  }

  return NextResponse.next(); // Allow the request to continue
}

export const config = {
  matcher: ['/', '/profile'], // Apply middleware only to these paths
};
