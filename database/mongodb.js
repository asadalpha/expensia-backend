import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI, {});
    console.log(`MongoDB connected: ${NODE_ENV}`);
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
