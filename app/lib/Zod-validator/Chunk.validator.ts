import { z } from "zod";

export const ChunkSchema = z.object({
  documentId: z.string().min(5),
  text: z.string().min(10),
  embedding: z.array(z.number()),
});
