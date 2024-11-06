export const dynamic = "force-dynamic";

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  const heroSection = await prisma.hero.findFirst();
  const ourMissionSection = await prisma.ourmission.findFirst();
  const caseStudySection = await prisma.casestudy.findMany();
  const reviewsSection = await prisma.reviews.findMany();
  const trustedBySection = await prisma.trustedby.findMany();
  const servicesSection = await prisma.services.findMany();
  const servicesPageContent = await prisma.servicepagecontent.findFirst();
  const servicesPageOurProcess = await prisma.servicepageourprocess.findFirst();
  return NextResponse.json(
    {
      heroSection,
      ourMissionSection,
      caseStudySection,
      reviewsSection,
      trustedBySection,
      servicesSection,
      servicesPageContent,
      servicesPageOurProcess,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.password !== password) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  // If authentication is successful, generate a JWT
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, {
    expiresIn: "7h", // Token expires in 7 hours
  });

  // Set the token in an httpOnly cookie
  const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
  response.cookies.set("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // Only set secure in production
    secure: false,
    maxAge: 7 * 60 * 60, // 7 hours in seconds
    path: "/",
    sameSite: "lax",
  });

  return response;
}
