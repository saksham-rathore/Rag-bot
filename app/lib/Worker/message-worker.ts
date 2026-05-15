import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { Worker } from "bullmq";
import { redisConnection } from "../redis";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import axios from "axios";

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

    // 2. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 0,
    });
    console.log("Step 3: Chunking");
    const texts = await splitter.splitDocuments(docsWithMetadata);
    console.log("Step 3 DONE");

    // 3. Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "text-embedding-004",
    });
    console.log("Step 4: Embeddings");

    // 3 & 4. Create embeddings and store in DB
    console.log("Step 4: Embedding + Qdrant");
    await QdrantVectorStore.fromDocuments(texts, embeddings, {
      url: process.env.QDRANT_ENDPOINT_KEY,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "langchainjs-testing",
    });
    console.log("Step 4 DONE");

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