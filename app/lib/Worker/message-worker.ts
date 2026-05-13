import { Worker } from 'bullmq';
import IORedis from 'ioredis';

// Establish connection to Valkey/Redis
const connection = new IORedis({ 
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null 
});

// Create the worker that listens to the 'message-queue'
const messageWorker = new Worker(
  'message-queue',
  async (job) => {
    console.log(`[Message Worker] Picked up job ${job.id}`);
    
    // Extract the data sent by the API
    const { messageText, userId } = job.data;
    
    // 1. You would put your heavy logic here!
    // Example: Sending messageText to OpenAI, saving to database, etc.
    console.log(`[Message Worker] Generating AI response for user ${userId} to message: "${messageText}"...`);
    
    // 2. Simulating a delay (like waiting for OpenAI to respond)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log(`[Message Worker] Finished processing job ${job.id}.`);
  },
  { connection }
);

console.log("Message Worker is running and listening for jobs on 'message-queue'...");
