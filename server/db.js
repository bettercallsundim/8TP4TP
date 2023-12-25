import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
function connectDB() {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Failed DB", error);
  }
}
connectDB();
