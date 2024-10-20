import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { promises as fs } from "fs";

const servicesSchema = z.object({
  headingText: z.string().min(1, { message: "Heading Text is required" }),
  bodyText: z.string().min(1, { message: "Body Text is required" }),
  image: z.any(),
});

export async function GET() {
  const services = await prisma.services.findMany();
  return NextResponse.json(services, { status: 200 });
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = servicesSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { headingText, bodyText, image } = parsedBody.data;

    const fileName = `services-${Date.now()}.png`;

    const services = await prisma.services.create({
      data: {
        image: fileName,
        headingText,
        text: bodyText,
      },
    });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const uploadDir = path.join(process.cwd(), "public", "uploads", "services");
    const filePath = path.join(uploadDir, fileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, base64Data, "base64");

    return NextResponse.json(
      services,
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /services:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
