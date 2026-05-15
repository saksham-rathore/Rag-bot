import { Queue } from "bullmq";
import { redisConnection } from "./app/lib/redis";

const fileQueue = new Queue("file-queue", { connection: redisConnection });

async function main() {
  const failedJobs = await fileQueue.getFailed(0, 5);
  for (const job of failedJobs) {
    console.log(`Job ${job.id} failed with error:`, job.failedReason);
    console.log(`URL:`, job.data.fileUrl);
  }
  process.exit(0);
}

main();