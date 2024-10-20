import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const service = await prisma.services.findUnique({
      where: { id },
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
    await prisma.services.delete({ where: { id } });
    return NextResponse.json({ message: "Service deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /services:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
