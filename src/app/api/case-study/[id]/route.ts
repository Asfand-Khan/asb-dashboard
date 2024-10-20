import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    console.log(id);
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
