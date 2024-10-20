import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const ourMissionSchema = z.object({
  bodyText: z.string().nonempty("Primary text is required"),
});

export async function GET(request: Request) {
    try {
      const ourmission = await prisma.ourmission.findFirst();
  
      if (!ourmission) {
        return NextResponse.json({ message: "Our Mission not found" }, { status: 404 });
      }
  
      return NextResponse.json(ourmission, { status: 200 });
  
    } catch (error) {
      console.error("Error in GET /our-mission:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = ourMissionSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { bodyText } = parsedBody.data;

    const ourmission = await prisma.ourmission.findFirst();

    if (!ourmission) {
      return NextResponse.json({ message: "Our Mission not found" }, { status: 404 });
    }

    const updatedOurMission = await prisma.ourmission.update({
      data: {
         bodyText,
      },
      where: { id: ourmission.id },
    });

    // const updatedOurMission = await prisma.ourmission.create({
    //     data:{
    //         bodyText
    //     }
    // })

    return NextResponse.json(updatedOurMission, { status: 200 });
  } catch (error) {
    console.error("Error in POST /our-mission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
