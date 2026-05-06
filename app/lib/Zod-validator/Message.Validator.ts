import { z } from "zod";

export const MessageSchema = z.object({
  userId: z.string().min(3, "User Id is required"),
  documentId: z.string().min(5, "Document Id is required"),

  role: z.enum(["user", "assistant"]),

  content: z
    .string()
    .min(5, "Message cannot be empty")
    .max(5000, "Message too long"),
});
