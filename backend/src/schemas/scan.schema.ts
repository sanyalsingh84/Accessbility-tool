import { z } from "zod";

export const createScanSchema = z.object({
  body: z.object({
    url: z
      .string()
      .min(1, "URL is required")
      .trim()
      .url({ message: "A valid URL must be provided" }),
  }),
});
