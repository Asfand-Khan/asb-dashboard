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
    const review = await prisma.reviews.findUnique({
      where: { id },
    });

    if (!review)
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 },
      );

    if (review.image) {
      await cloudinary.api.delete_resources([review.image], {
        type: "upload",
        resource_type: "image",
      });
    }
    await prisma.reviews.delete({ where: { id } });
    return NextResponse.json({ message: "Reveiw deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
