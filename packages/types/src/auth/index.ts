import { z } from "zod";

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required").min(8, "Must be at least 8 characters"),
});

export type AuthSchema = z.output<typeof schema>;
