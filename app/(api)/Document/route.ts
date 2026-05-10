import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db.connect";
import Document from "@/app/Model/Document";
import User from "@/app/Model/User";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { queue } from "@/app/lib/Queue";

type CloudinaryUploadResult = {
  secure_url: string;
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  try {
    await dbConnect();

    const formdata = await req.formData();
    const file = formdata.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "no file uploaded",
        },
        {
          status: 404,
        },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", public_id: file.name.split(".")[0] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    const fileUrl = (uploadResult as CloudinaryUploadResult).secure_url;

    // Save in DB
    const newDoc = await Document.create({
      title: file.name,
      fileUrl: fileUrl,
      userId: session?.user?.id,
    });

    // Add job to the queue
    await queue.add('file-ready', {
      documentId: newDoc._id.toString(),
      fileUrl: fileUrl,
      filename: file.name,
    });

    return NextResponse.json({
      message: "Document uploaded",
      DocumentId: newDoc._id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
