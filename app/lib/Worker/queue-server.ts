import { Queue } from 'bullmq';
import { redisConnection } from '../redis';

export const fileQueue = new Queue('file-queue', {
  connection: redisConnection,
});