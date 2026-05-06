import { z } from "zod";

export const DocumentSchema = z.object({
  title: z.string().min(3, "Title is required"),
  fileUrl: z.string().url("Invalid file URL"),
});
