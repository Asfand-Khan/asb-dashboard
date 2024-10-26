import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function GET() {
  const blogs = await prisma.blog.findMany();
  return NextResponse.json(blogs, { status: 200 });
}

export async function POST(request: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Missing Cloudinary Credentials" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const longDesc = formData.get("longDesc") as string;
    const slug = formData.get("slug") as string;
    const update = formData.get("update") as string;

    if (!title || !shortDesc || !longDesc || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (update == "true") {
      console.log("update chaloao");

      const blog = await prisma.blog.findUnique({
        where:{
          slug: slug
        }
      })

      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      await cloudinary.api.delete_resources([blog.image], {
        type: "upload",
        resource_type: "image",
      });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ASB-blogs" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            },
          );

          uploadStream.end(buffer);
        },
      );

      const updatedBlog = await prisma.blog.update({
        where: {
          slug: slug,
        },
        data:{
          title,
          longDesc,
          slug,
          shortDesc,
          image: result.public_id,
        }
      })


      return NextResponse.json(updatedBlog, { status: 200 });
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ASB-blogs" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            },
          );

          uploadStream.end(buffer);
        },
      );

      const blogs = await prisma.blog.create({
        data: {
          title,
          longDesc,
          slug,
          shortDesc,
          image: result.public_id,
        },
      });

      return NextResponse.json(blogs, { status: 200 });
    }
  } catch (error) {
    console.error("Error in POST /blogs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
