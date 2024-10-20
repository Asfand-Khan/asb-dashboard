import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { promises as fs } from "fs";

const trustedBySchema = z.object({
    reviewerName: z.string().min(1, { message: "Reviewer is required" }),
    review: z.string().min(1, { message: "Review is required" }),
    image: z.any(),
  });

export async function GET() {
    const reviews = await prisma.reviews.findMany();
    return NextResponse.json(reviews, { status: 200 });
}
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const parsedBody = trustedBySchema.safeParse(body);
  
      if (!parsedBody.success) {
        return NextResponse.json(
          {
            message: "Validation failed",
            errors: parsedBody.error.flatten(),
          },
          { status: 400 },
        );
      }
  
      const { review,reviewerName, image } = parsedBody.data;
  
      const fileName = `review-${Date.now()}.png`;
  
      const caseStudy = await prisma.reviews.create({
        data: {
          image: fileName,
          review,
          reviewerName
        },
      });
  
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "review",
      );
      const filePath = path.join(uploadDir, fileName);
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, base64Data, "base64");
  
      return NextResponse.json(
        { ...caseStudy, image: fileName },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error in POST /review:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  }