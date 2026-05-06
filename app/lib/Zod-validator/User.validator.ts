import { z } from "zod";

export const UserSchema = z.object({
  Username: z
    .string()
    .min(3, "Username must be at least 3 Characters")
    .max(20, "Username too long")
    .trim(),

  email: z.string().email("Invalid format").toLowerCase(),

  Password: z.string().min(6, "Password must be at least 6 Characters").max(50),
});
