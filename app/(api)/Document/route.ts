import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db.connect";
import Document from "@/app/Model/Document";
import User from "@/app/Model/User";
import { getServerSession } from "next-auth"
import fs from "fs/promises"

export async function POST(req: NextRequest) {
    const session = await getServerSession()
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
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // TEMP: Save file locally (later replace with Cloudinary/S3)
    const filePath = `./public/uploads/${file.name}`
    await fs.writeFile(filePath, buffer)

    // 👉 Save in DB
    const newDoc = await Document.create({
        title: file.name,
        fileUrl: `./public/uploads/${file.name}`,
        userId: session?.user?.id
    })

    return NextResponse.json({
        message: "Document uploaded",
        DocumentId: newDoc._id
    })

  } catch (error) {
    console.log(error)
    return NextResponse.json({
        error: "Upload failed"
    },{
        status: 500
    })
  }
}
