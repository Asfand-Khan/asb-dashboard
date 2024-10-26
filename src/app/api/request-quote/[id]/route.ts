import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote)
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });

    return NextResponse.json(quote, { status: 200 });
  } catch (error) {
    console.error("Error in GET /quote-id:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote)
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });

    if (quote.file) {
      await cloudinary.uploader.destroy(`${quote.file}`, {
        resource_type: "raw",
        type: "upload",
      });
    }

    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ message: " Quote deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
