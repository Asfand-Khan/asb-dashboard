import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
    const trustedBy = await prisma.trustedby.findMany();
    return NextResponse.json(trustedBy, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const { image64 } = await request.json();

    if (!image64) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }
    const fileName = `trusted-by-${Date.now()}.png`;

    const newTrustedBy = await prisma.trustedby.create({
      data: {
        image: fileName,
      },
    });

    const base64Data = image64.replace(/^data:image\/\w+;base64,/, "");
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "trusted-by",
    );
    const filePath = path.join(uploadDir, fileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, base64Data, "base64");

    return NextResponse.json(newTrustedBy, { status: 200 });
  } catch (error) {
    console.error("Error in POST /trusted-by:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
