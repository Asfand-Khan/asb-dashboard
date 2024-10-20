import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { promises as fs } from "fs";
import prisma from "@/utils/prisma";

const caseStudySchema = z.object({
  location: z.string().nonempty("Primary text is required"),
  problem: z.string().nonempty("Secondary text is required"),
  solution: z.string().nonempty("Solution text is required"),
  image: z.string().nonempty("Image is required"),
});

export async function GET() {
    const casestudies = await prisma.casestudy.findMany();
    return NextResponse.json(casestudies,{status:200});
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = caseStudySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { location, problem, solution, image } = parsedBody.data;

    const fileName = `case-study-${Date.now()}.png`;

    const caseStudy = await prisma.casestudy.create({
      data: {
        location,
        problem,
        solution,
        image: fileName,
      },
    });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "case-study",
    );
    const filePath = path.join(uploadDir, fileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, base64Data, "base64");

    return NextResponse.json(
      { ...caseStudy, image: fileName },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /case-study:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
