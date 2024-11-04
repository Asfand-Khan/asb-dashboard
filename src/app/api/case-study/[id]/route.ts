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
    const caseStudy = await prisma.casestudy.findUnique({
      where: { id },
    });

    if (!caseStudy)
      return NextResponse.json(
        { message: "Case Study not found" },
        { status: 404 },
      );

    for (const image of caseStudy.images) {
      await cloudinary.api.delete_resources([image], {
        type: "upload",
        resource_type: "image",
      });
    }

    await prisma.casestudy.delete({ where: { id } });

    return NextResponse.json(
      { message: "Case Study deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /case-study:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
