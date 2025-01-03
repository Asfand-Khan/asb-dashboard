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

    const quote = await prisma.customquote.findUnique({
      where: { id },
    });

    if (!quote)
      return NextResponse.json({ message: "Custom Quote not found" }, { status: 404 });

    return NextResponse.json(quote, { status: 200 });
  } catch (error) {
    console.error("Error in GET /custom-quote-id:", error);
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

    const customQuote = await prisma.customquote.findUnique({
      where: { id },
    });

    if (!customQuote)
      return NextResponse.json(
        { message: "Custom Quote not found" },
        { status: 404 },
      );

    if (customQuote.file) {
      await cloudinary.uploader.destroy(`${customQuote.file}`, {resource_type: 'raw',type:'upload'})
    }

    await prisma.customquote.delete({ where: { id } });
    return NextResponse.json({ message: "Custom Quote deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /custom-quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
