import { z } from "zod";

export const createScanSchema = z.object({
  body: z.object({
    url: z
      .string({
        required_error: "URL is required",
      })
      .trim()
      .url({ message: "A valid URL must be provided" }),
  }),
});
