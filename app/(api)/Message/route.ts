import dbConnect from "@/app/lib/db.connect";
import { askAI } from "@/app/lib/openai";
import { NextResponse } from "next/server";
import { queryQdrant } from "@/app/lib/qdrant";
import embeddings from "@/app/lib/embeddings";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const {question, DocumentId} = await req.json();

        if (!question) {
            return NextResponse.json({error: "Question is required"}, {status: 400})
        }

        const context = await queryQdrant(question, embeddings);

        const answer = await askAI(question, context);

        return NextResponse.json({
            answer,
        });

        } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}