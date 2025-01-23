import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const url = process.env.DB_URL; 

export const connectDB = async () => {
  if (!url) {
    console.error("Database URL (DB_URL) is not defined in environment variables.");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB at ${url}`);
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error while connecting to the database:", error.message);
    process.exit(1); 
  }
};
