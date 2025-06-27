import mongoose from "mongoose";
import logger from "../utils/logger";
import { getEnv } from "./env";

const connectDB = async () => {
    try {
        await mongoose.connect(getEnv("MONGO_URI"));
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error(`Error connecting to MongoDB ${error}`);
        process.exit(1);
    }
}

export default connectDB;