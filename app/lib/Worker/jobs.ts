import { fileQueue } from './queue-server';

export async function addFileJob(data: {
  fileUrl: string;
  filename: string;
}) {
  await fileQueue.add('file-ready', data);
}