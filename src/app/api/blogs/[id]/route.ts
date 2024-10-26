import prisma from "@/utils/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

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
    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    await cloudinary.api.delete_resources([blog.image], {
      type: "upload",
      resource_type: "image",
    });

    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /blog:", error);

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
    const blog = await prisma.blog.findUnique({
      where: {
        slug: id,
      },
    });

    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error in GET /blog:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
