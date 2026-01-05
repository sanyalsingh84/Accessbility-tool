import { Schema, model, Types, type InferSchemaType } from "mongoose";

export type ScanStatus = "queued" | "running" | "completed" | "failed";

const scanSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\//,
    },

    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"] as const,
      default: "queued",
      index: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export type Scan = InferSchemaType<typeof scanSchema>;
export const ScanModel = model("Scan", scanSchema);
