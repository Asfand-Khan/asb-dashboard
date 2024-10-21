import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Create a response object
  const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

  // Clear the token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only set secure in production
    maxAge: -1, // Set maxAge to -1 to expire the cookie immediately
    path: "/",
  });

  return response;
}
