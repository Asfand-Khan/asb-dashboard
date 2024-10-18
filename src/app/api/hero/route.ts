import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const heroSchema = z.object({
  primaryText: z.string().nonempty("Primary text is required"),
  secondaryText: z.string().nonempty("Secondary text is required"),
});

export async function GET(request: Request) {
    try {
      const hero = await prisma.hero.findFirst();
  
      if (!hero) {
        return NextResponse.json({ message: "Hero not found" }, { status: 404 });
      }
  
      return NextResponse.json(hero, { status: 200 });
  
    } catch (error) {
      console.error("Error in GET /hero:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = heroSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { primaryText, secondaryText } = parsedBody.data;

    const hero = await prisma.hero.findFirst();

    if (!hero) {
      return NextResponse.json({ message: "Hero not found" }, { status: 404 });
    }

    const updatedHero = await prisma.hero.update({
      data: {
        primaryText,
        secondaryText,
      },
      where: { id: hero.id },
    });

    return NextResponse.json(updatedHero, { status: 200 });
  } catch (error) {
    console.error("Error in POST /hero:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
