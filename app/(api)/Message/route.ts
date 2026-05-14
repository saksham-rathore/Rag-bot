import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/option";
import dbConnect from "@/app/lib/db.connect";
import Message from "@/app/Model/Message";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatOpenAI } from "@langchain/openai";

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
        { status: 400 }
      );
    }

    // 3. Save User Message to Database
    await Message.create({
      userId: session.user.id,
      documentId: documentId,
      role: "user",
      content: message,
    });

    // 4. Initialize Vector Store & Get Context
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      }
    );

    // Retrieve the 4 most relevant document chunks
    const searchResults = await vectorStore.similaritySearch(message, 4);
    const contextText = searchResults.map((doc) => doc.pageContent).join("\n\n");

    // 5. Initialize Chat Model (LLM) and Generate Response
    const chatModel = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
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
    console.error("Message API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing the message" },
      { status: 500 }
    );
  }
}
