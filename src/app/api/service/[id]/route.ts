import prisma from "@/utils/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const service = await prisma.service.findUnique({
      where: {
        id: id,
      },
    });

    if (!service)
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );

    await cloudinary.api.delete_resources([service.image], {
      type: "upload",
      resource_type: "image",
    });

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Service deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /service:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const service = await prisma.service.findUnique({
      where: {
        slug: id,
      },
    });

    if (!service)
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error in GET /service:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

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

    const service = await prisma.service.findUnique({
      where: {
        slug: id,
      },
    });

    if (!service)
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const longDesc = formData.get("longDesc") as string;
    const serviceDesc = formData.get("serviceDesc") as string;
    const serviceProcessDesc = formData.get("serviceProcessDesc") as string;
    const slug = formData.get("slug") as string;

    if (
      !title ||
      !shortDesc ||
      !longDesc ||
      !slug ||
      !serviceDesc ||
      !serviceProcessDesc
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    await cloudinary.api.delete_resources([service.image], {
      type: "upload",
      resource_type: "image",
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "ASB-service" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          },
        );

        uploadStream.end(buffer);
      },
    );

    const updatedService = await prisma.service.update({
      where: {
        slug: id,
      },
      data: {
        title,
        longDesc,
        slug,
        shortDesc,
        serviceDesc,
        serviceProcessDesc,
        image: result.public_id,
      },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /service-[id]:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
