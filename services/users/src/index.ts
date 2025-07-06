import app from "./app";
import { getEnv } from "./config/env";
import logger from "./utils/logger";
import connectDB from "./config/db";
import { collectDefaultMetrics, register } from "prom-client";

const main = async () => {
    try {
        collectDefaultMetrics({register:register});
        
        await connectDB();
        app.listen(getEnv("PORT") , () => {
            logger.info(`user-service started on PORT : ${getEnv("PORT")}`)
        })
    } catch (error) {
        logger.error(`error starting user-service ${error}`);
        process.exit(1)
    }
}

main();