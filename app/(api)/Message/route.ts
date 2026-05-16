import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/option";
import dbConnect from "@/app/lib/db.connect";
import Message from "@/app/Model/Message";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function embedText(apiKey: string, text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: {
          parts: [
            {
              text: text,
            },
          ],
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("FULL ERROR:", err);
    throw new Error(`Gemini Embed failed (${res.status}): ${err}`);
  }

  const data = await res.json();

  return data.embedding.values;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Connect to Database & Verify Session
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the Request
    const body = await req.json();
    const { message, documentId } = body;

    if (!message || !documentId) {
      return NextResponse.json(
        { error: "message and documentId are required" },
        { status: 400 },
      );
    }

    // 3. Save User Message to Database
    await Message.create({
      userId: session.user.id,
      documentId: documentId,
      role: "user",
      content: message,
    });

    // 4. Embed query using Gemini
    const queryVector = await embedText(process.env.GEMINI_API_KEY!, message);

    const qdrant = new QdrantClient({
      url: process.env.QDRANT_ENDPOINT_KEY,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const searchResults = await qdrant.search("langchainjs-gemini", {
      vector: queryVector,
      limit: 4,
      with_payload: true,
      filter: {
        must: [
          {
            key: "documentId",
            match: { value: documentId },
          },
        ],
      },
    });

    const contextText = searchResults
      .map((r) => r.payload?.pageContent as string)
      .filter(Boolean)
      .join("\n\n");

    // 5. Generate Response with Gemini
    const chatModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0.5,
    });

    const systemPrompt = `You are a helpful AI assistant answering questions about a specific document.
Use the following pieces of context from the document to answer the user's question.
If the answer is not in the context, just say you don't know and don't make up an answer.

Context:
${contextText}`;

    const aiResponse = await chatModel.invoke([
      ["system", systemPrompt],
      ["user", message],
    ]);

    const aiMessageContent = aiResponse.content as string;

    // 6. Save Assistant's Message to Database
    const savedAiMessage = await Message.create({
      userId: session.user.id,
      documentId: documentId,
      role: "assistant",
      content: aiMessageContent,
    });

    // 7. Return the Response
    return NextResponse.json({
      message: aiMessageContent,
      messageId: savedAiMessage._id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Message API Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
