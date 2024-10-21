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

export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*"); // Adjust this as per your needs (e.g., allow specific origins)
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response("Options", { status: 204, headers });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const comments = formData.get("comments") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const primaryContact = formData.get("primaryContact") as string;
    const email = formData.get("email") as string;

    if (!phoneNumber || !jobTitle || !primaryContact || !email) {
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
            { folder: "ASB-custom-quote" },
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

    const custom_quote = await prisma.customquote.create({
      data: {
        email,
        file: public_id,
        jobTitle,
        primaryContactName: primaryContact,
        phoneNumber: phoneNumber,
        comments: comments,
      },
    });

    const response = NextResponse.json(custom_quote, { status: 200 });
    response.headers.set("Access-Control-Allow-Origin", "*");

    return response;
  } catch (error) {
    console.error("Error in POST /custom-quote:", error);
    const response = NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
    response.headers.set("Access-Control-Allow-Origin", "*");

    return response;
  }
}
