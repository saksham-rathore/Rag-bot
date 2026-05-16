import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { Worker } from "bullmq";
import { redisConnection } from "../redis";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import { QdrantClient } from "@qdrant/js-client-rest";
import axios from "axios";

const COLLECTION_NAME = "langchainjs-cohere";
const VECTOR_SIZE = 1024; // Cohere embed-english-v3.0 output dimension

async function embedDocuments(apiKey: string, texts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.cohere.com/v1/embed", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "embed-english-v3.0",
      texts: texts,
      input_type: "search_document",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cohere Embed failed (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.embeddings;
}

const worker = new Worker(
  "file-queue",
  async (job) => {
    console.log("Processing job:", job.name);
    console.log("Data:", job.data);

    // 1. Download PDF
    console.log("Step 1: Starting download");
    const response = await axios.get(job.data.fileUrl, {
      responseType: "arraybuffer",
    });
    console.log("Step 1 DONE");

    // 2. Load PDF
    console.log("Step 2: Loading PDF");
    const blob = new Blob([response.data], { type: "application/pdf" });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    console.log("Step 2 DONE");

    // Attach documentId to metadata
    const docsWithMetadata = docs.map((doc) => {
      doc.metadata = { ...doc.metadata, documentId: job.data.documentId };
      return doc;
    });

    // 3. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    console.log("Step 3: Chunking");
    const texts = await splitter.splitDocuments(docsWithMetadata);
    console.log(`Step 3 DONE - ${texts.length} chunks`);

    console.log("Step 4: Embedding");
    const vectors = await embedDocuments(process.env.COHERE_API_KEY!, texts.map((t) => t.pageContent));
    console.log("Step 4 DONE");

    // 5. Upload to Qdrant directly (bypasses @langchain/qdrant bug)
    console.log("Step 5: Uploading to Qdrant");
    const client = new QdrantClient({
      url: process.env.QDRANT_ENDPOINT_KEY,
      apiKey: process.env.QDRANT_API_KEY,
    });

    // Ensure collection exists
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );
    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: { size: VECTOR_SIZE, distance: "Cosine" },
      });
      console.log(`Created collection: ${COLLECTION_NAME}`);
    }

    // Upload points
    const points = vectors.map((vector, i) => ({
      id: crypto.randomUUID(),
      vector,
      payload: {
        pageContent: texts[i].pageContent,
        ...texts[i].metadata,
      },
    }));

    await client.upsert(COLLECTION_NAME, { points });
    console.log(`Step 5 DONE - uploaded ${points.length} vectors`);

    console.log("Job completed");
  },
  {
    concurrency: 2,
    connection: redisConnection,
    lockDuration: 600000,
    maxStalledCount: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err);
});

console.log("Worker started!");
console.log("Worker is listening for jobs...");