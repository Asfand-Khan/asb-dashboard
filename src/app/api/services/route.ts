import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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
  const services = await prisma.services.findMany();
  return NextResponse.json(services, { status: 200 });
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
    const headingText = formData.get("headingText") as string;
    const bodyText = formData.get("bodyText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "ASB-services" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          },
        );

        uploadStream.end(buffer);
      },
    );

    const newService = await prisma.services.create({
      data: {
        headingText,
        text: bodyText,
        image: result.public_id,
      },
    });

    return NextResponse.json(newService, { status: 200 });
  } catch (error) {
    console.error("Error in POST /services:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
