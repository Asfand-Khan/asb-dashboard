export const dynamic = "force-dynamic";

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

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
