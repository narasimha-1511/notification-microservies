import app from "./app";
import { getEnv } from "./config/env";
import logger from "./utils/logger";
import connectDB from "./config/db";

const preReq = async () => {
   await connectDB();
}

preReq().then(() => {
    app.listen(getEnv("PORT") , () => {
        logger.info(`user-service started on PORT : ${getEnv("PORT")}`)
    })
}).catch((error) => {
    logger.error(`error starting user-service ${error}`);
    process.exit(1)
})