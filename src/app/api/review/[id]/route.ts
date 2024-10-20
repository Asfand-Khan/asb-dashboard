import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    console.log(id);
    await prisma.reviews.delete({ where: { id } });
    return NextResponse.json(
      { message: "Reveiw deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
