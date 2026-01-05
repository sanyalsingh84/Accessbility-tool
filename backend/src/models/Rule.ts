import { Schema, model, type InferSchemaType } from "mongoose";

const ruleSchema = new Schema(
  {
    // this is the 'id' from axe-core, e.g. "color-contrast"
    ruleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    help: {
      type: String,
      required: true,
    },
    helpUrl: {
      type: String,
      required: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

export type Rule = InferSchemaType<typeof ruleSchema>;
export const RuleModel = model("Rule", ruleSchema);
