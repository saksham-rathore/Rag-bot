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
    const data = JSON.parse(job.data);

    // 1. Download PDF
    const response = await axios.get(data.fileUrl);

    const loader = new PDFLoader(response.data);
    const docs = await loader.load();

    // 2. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 0,
    });
    const texts = await splitter.splitDocuments(docs);

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

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err);
});
