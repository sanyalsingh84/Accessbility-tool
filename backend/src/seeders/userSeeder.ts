import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  await UserModel.deleteMany(); // ⚠️ removes all users (dev only)

  await UserModel.create([
    {
      name: "Admin User",
      email: "admin@test.com",
      password: "admin123", // will be hashed by pre-save hook
    },
    {
      name: "Test User",
      email: "user@test.com",
      password: "user1234",
    },
  ]);

  console.log("✅ Users seeded");
};

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ DB connected");

    await seedUsers();

    await mongoose.disconnect();
    console.log("🔌 DB disconnected");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

runSeed();
