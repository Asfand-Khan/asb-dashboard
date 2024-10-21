import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const comment = formData.get("comment") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const projectType = formData.get("projectType") as string;
    const role = formData.get("role") as string;
    const service = formData.get("service") as string;

    if (!email || !name || !phone || !projectType || !role || !service) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const file = formData.get("file") as File;
    let public_id: string | null = null;

    if (file) {
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

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ASB-request-quote" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            },
          );

          uploadStream.end(buffer);
        },
      );

      public_id = result.public_id;
    }

    const quote = await prisma.quote.create({
      data: {
        email,
        name,
        phone,
        projectType,
        jobTitle: role,
        services: service,
        comments: comment,
        file: public_id,
      },
    });

    return NextResponse.json(quote, { status: 200 });
  } catch (error) {
    console.error("Error in POST /request-quote:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
