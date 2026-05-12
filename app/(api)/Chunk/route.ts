import dbConnect from "@/app/lib/db.connect";
import embeddings from "@/app/lib/embeddings";
import { loadPDF } from "@/app/lib/pdf-parse";
import openai from "@/app/lib/openai";
import { storeDocumentsInQdrant } from "@/app/lib/qdrant";
import { splitText } from "@/app/lib/splitter";
import { NextResponse } from "next/server";
import { fileURLToPath } from "url";
import type { Document } from "@langchain/core/documents";
import type { Embeddings } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";


export async function POST(req: Request) {
    try {
        await dbConnect();

        const {fileUrl, DocumentId} = await req.json();

        if (!fileUrl) {
            return NextResponse.json({error: "File Url missing"}, {status: 400});
        }

        const text = await loadPDF(fileUrl);

        const chunks = await splitText(text);

        const vector = await embeddings(chunks);

        await storeDocumentsInQdrant(docs, embeddings)

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}