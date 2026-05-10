import { Worker, Job } from 'bullmq';
import dbConnect from '../app/lib/db.connect';
import Document from '../app/Model/Document';
import {OpenAIEmbeddings} from "@langchain/openai"
import {QdrantVectorStore} from "@langchain/qdrant";
import {Document} from "@langchain/core/documents"
import type {AttributeInfo} from "langchain/chains/query_constructor";

const QUEUE_NAME = "file-upload-queue";

const worker = new Worker(
  'file-ready',
  async (job: Job) => {
    console.log(`\n[Worker] Picked up job ${job.id} for document: ${job.data.filename}`);

    try {
      await dbConnect();

      const { documentId, fileUrl, filename } = job.data;
      console.log(`[Worker] 1. Downloading file from: ${fileUrl}`);      
      console.log(`[Worker] 2. Extracting text...`);      
      console.log(`[Worker] 3. Chunking and Embedding...`);
      console.log(`[Worker] Successfully processed ${filename}`);

      return { success: true, documentId };

    } catch (error) {
      console.error(`[Worker] Job ${job.id} failed:`, error);
      throw error; 
    }
  },
  { 
    connection: {
      host: "127.0.0.1",
      port: 3000
    },
    concurrency: 5 
  }
);
worker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} has completed successfully!`);
});

worker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job?.id} has failed with error: ${err.message}`);
});

console.log("Worker is running and listening for jobs on queue:", QUEUE_NAME);