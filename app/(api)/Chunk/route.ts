import dbConnect from "@/app/lib/db.connect";
import embeddings from "@/app/lib/embeddings";
import { loadPDF } from "@/app/lib/pdf-parse";
import { storeDocumentsInQdrant } from "@/app/lib/qdrant";
import { splitText } from "@/app/lib/splitter";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await dbConnect();

        const {fileUrl, DocumentId} = await req.json();

        if (!fileUrl) {
            return NextResponse.json({error: "File Url missing"}, {status: 400});
        }

        const text = await loadPDF(fileUrl);

        const docs = await splitText(text);

        await storeDocumentsInQdrant(docs, embeddings);

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}