import axe from "axe-core";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../db/connect";
import { RuleModel } from "../models/Rule";

// configure dotenv
dotenv.config();

const seedRules = async () => {
  try {
    await connectDB();
    console.log("✅ Database connection successful.");

    // Clear existing rules to prevent duplicates
    await RuleModel.deleteMany({});
    console.log("🧹 Cleared existing rules collection.");

    // Get rules from axe-core
    const axeRules = axe.getRules();

    const rulesToInsert = axeRules.map((rule) => ({
      ruleId: rule.ruleId,
      description: rule.description,
      help: rule.help,
      helpUrl: rule.helpUrl,
      tags: rule.tags,
    }));

    // Bulk insert new rules
    await RuleModel.insertMany(rulesToInsert);
    console.log(`✅ Successfully seeded ${rulesToInsert.length} rules.`);
  } catch (error) {
    console.error("❌ Error seeding rules:", error);
    process.exit(1);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("👋 Disconnected from database.");
  }
};

seedRules();
