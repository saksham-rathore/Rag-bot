import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Document from "@/app/Model/Document";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/option";
import { addFileJob } from "@/app/lib/Worker/jobs";
import dbConnect from "@/app/lib/db.connect";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file") as unknown as File;
    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", public_id: file.name.split(".")[0] },
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
      userId: session.user.id,
    });

    // Add job to the queue
    await addFileJob({
      fileUrl: fileUrl,
      filename: file.name,
      documentId: newDoc._id.toString(),
    });

    return NextResponse.json({
      message: "Document uploaded successfully",
      DocumentId: newDoc._id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 },
    );
  }
}