import { Queue } from "bullmq";

export const queue = new Queue("file-upload-queue");
