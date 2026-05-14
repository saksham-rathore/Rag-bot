import { Worker } from 'bullmq';
import { redisConnection } from '../redis';

const worker = new Worker(
  'file-queue',
  async (job) => {
    console.log('Processing job:', job.name);
    console.log('Data:', job.data);

    //  actual logic here:
    // 1. Download PDF
    // 2. Split into chunks
    // 3. Create embeddings
    // 4. Store in DB

    await new Promise((res) => setTimeout(res, 3000));

    console.log('Job completed');
  },
  {
    connection: redisConnection,
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed:`, err);
});