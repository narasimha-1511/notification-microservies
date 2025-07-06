import app from "./app";
import connectDB from "./config/db";
import { getEnv } from "./config/env";
import logger from "./utils/logger";
import { connectToRabbitMq } from "./utils/rabbitMq";
import handlers from "./handlers";
import { collectDefaultMetrics, register } from "prom-client";

const main = async () => {
    try {
        //monitoring
        collectDefaultMetrics({register: register});

        await connectDB();
        await connectToRabbitMq(["orders-exchange", "notifications-exchange"]);
        await handlers();
        
        app.listen(getEnv('PORT'), () => {
            logger.info(`Server is running on port ${getEnv('PORT')}`);
        });
    } catch (error) {
        logger.error(`Error starting server: ${error}`);
        process.exit(1);
    }
}

main();