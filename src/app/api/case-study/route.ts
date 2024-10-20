import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/utils/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function GET() {
  const casestudies = await prisma.casestudy.findMany();
  return NextResponse.json(casestudies, { status: 200 });
}

export async function POST(request: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Missing Cloudinary Credentials" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const location = formData.get("location") as string;
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "ASB-case-study" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          },
        );

        uploadStream.end(buffer);
      },
    );

    const caseStudy = await prisma.casestudy.create({
      data: {
        location,
        problem,
        solution,
        image: result.public_id,
      },
    });

    return NextResponse.json(caseStudy, { status: 200 });
  } catch (error) {
    console.error("Error in POST /case-study:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
