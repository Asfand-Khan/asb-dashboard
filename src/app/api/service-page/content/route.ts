import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const servicePageContent = await prisma.servicepagecontent.findFirst();

    if (!servicePageContent) {
      return NextResponse.json(
        { message: "Service Page Content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(servicePageContent, { status: 200 });
  } catch (error) {
    console.error("Error in GET /servicePageContent:", error);
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
          message: "Content is required",
        },
        { status: 400 },
      );
    }

    const result = await prisma.servicepagecontent.findFirst();

    if (!result) {
      return NextResponse.json(
        { message: "Service Page Content not found" },
        { status: 404 },
      );
    }

    const newContent = await prisma.servicepagecontent.update({
      data: {
        bodyText: content,
      },
      where: {
        id: result.id,
      },
    });

    return NextResponse.json(newContent, { status: 200 });
  } catch (error) {
    console.error("Error in POST /servicePageContent:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
