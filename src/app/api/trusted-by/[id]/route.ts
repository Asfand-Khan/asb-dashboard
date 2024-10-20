import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    console.log(id);
    await prisma.trustedby.delete({ where: { id } });
    return NextResponse.json(
      { message: "Trusted By deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /trusted-by:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
