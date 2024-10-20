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
    const trustedBy = await prisma.trustedby.findUnique({
      where: { id },
    });

    if (!trustedBy)
      return NextResponse.json(
        { message: "Trusted by not found" },
        { status: 404 },
      );

    await cloudinary.api.delete_resources([trustedBy.image], {
      type: "upload",
      resource_type: "image",
    });
    await prisma.trustedby.delete({ where: { id } });
    return NextResponse.json(
      { message: "Trusted By deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /trusted-by:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
