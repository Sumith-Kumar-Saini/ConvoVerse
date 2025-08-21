import { z } from "zod";

export const loginSchema = z.object({
  body: z
    .object({
      email: z.email("Invalid email formant").optional(),
      username: z.string().trim().optional(),
      password: z.string(),
    })
    .refine((data) => data.email || data.username, {
      message: "Either email or username is required",
      path: ["email"],
    }),
});
