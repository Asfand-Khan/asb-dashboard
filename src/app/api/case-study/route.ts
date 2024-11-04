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
    const file1 = formData.get("file1") as File;
    const file2 = formData.get("file2") as File;
    const file3 = formData.get("file3") as File;
    const content = formData.get("content") as string;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    if (!file1) {
      return NextResponse.json(
        { error: "Image 1 is required" },
        { status: 400 },
      );
    }

    let public_ids: string[] = [];

    if(file1) {
      const bytes = await file1.arrayBuffer();
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

      public_ids.push(result.public_id);
    }

    if(file2) {
      const bytes = await file2.arrayBuffer();
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

      public_ids.push(result.public_id);
    }

    if(file3) {
      const bytes = await file3.arrayBuffer();
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

      public_ids.push(result.public_id);
    }

    const caseStudy = await prisma.casestudy.create({
      data: {
        content: content,
        images: public_ids,
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
