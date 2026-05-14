import { Worker } from "bullmq";
import { redisConnection } from "../redis";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import axios from "axios";

const worker = new Worker(
  "file-queue",
  async (job) => {
    console.log("Processing job:", job.name);
    console.log("Data:", job.data);

    // 1. Download PDF
    const response = await axios.get(job.data.fileUrl, { responseType: 'arraybuffer' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    // Attach documentId to metadata
    const docsWithMetadata = docs.map(doc => {
      doc.metadata = { ...doc.metadata, documentId: job.data.documentId };
      return doc;
    });

    // 2. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 0,
    });
    const texts = await splitter.splitDocuments(docsWithMetadata);

    // 3. Create embeddings
    const embeddings = new OpenAIEmbeddings();
    
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      },
    );

    // 4. Store in DB
    await vectorStore.addDocuments(texts);

    await new Promise((res) => setTimeout(res, 3000));

    console.log("Job completed");
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

console.log("Worker started!")

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err);
});

console.log("Worker is listening for jobs...")