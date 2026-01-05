import { Schema, model, Types, type InferSchemaType } from "mongoose";

export type ViolationImpact = "minor" | "moderate" | "serious" | "critical";

const violationSchema = new Schema(
  {
    scan: {
      type: Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true,
    },

    // Reference to the rule document
    rule: {
      type: Types.ObjectId,
      ref: "Rule",
      required: true,
    },

    impact: {
      type: String,
      enum: ["minor", "moderate", "serious", "critical"] as const,
      required: true,
      index: true,
    },

    // The specific HTML snippet that violates the rule
    html: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

violationSchema.index({ scan: 1, impact: 1 });

export type Violation = InferSchemaType<typeof violationSchema>;
export const ViolationModel = model("Violation", violationSchema);
