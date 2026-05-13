import { Queue } from 'bullmq';

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

export const fileQueue = new Queue('file-queue', { connection });
export const messageQueue = new Queue('message-queue', { connection });