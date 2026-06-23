import { z } from "zod";

export const authSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required").min(8, "Must be at least 8 characters"),
});

export type AuthSchema = z.infer<typeof authSchema>;
