import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const serviceOurProcessContent = await prisma.servicepageourprocess.findFirst();

    if (!serviceOurProcessContent) {
      return NextResponse.json(
        { message: "Our Process Content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(serviceOurProcessContent, { status: 200 });
  } catch (error) {
    console.error("Error in GET /serviceOurProcessContent:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const content = formData.get("content") as string;

    if (!content) {
      return NextResponse.json(
        {
          message: "Our Process Content is required",
        },
        { status: 400 },
      );
    }

    const result = await prisma.servicepageourprocess.findFirst();

    if (!result) {
      return NextResponse.json(
        { message: "Our Process Content not found" },
        { status: 404 },
      );
    }

    const newContent = await prisma.servicepageourprocess.update({
      data: {
        bodyText: content,
      },
      where: {
        id: result.id,
      },
    });

    return NextResponse.json(newContent, { status: 200 });
  } catch (error) {
    console.error("Error in POST /serviceOurProcessContent:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
