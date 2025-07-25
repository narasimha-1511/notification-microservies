import app from "./app";
import connectDB from "./config/db";
import { getEnv } from "./config/env";
import { connectToRabbitMq } from "./utils/rabbitMq";
import logger from "./utils/logger";
import handlers from "./handlers";
import { collectDefaultMetrics, register } from "prom-client";

const main = async () => {
  try {
    collectDefaultMetrics({register:register});

    await connectDB();
    await connectToRabbitMq(["orders-exchange"]);
    await handlers();

    app.listen(getEnv("PORT"), () => {
      logger.info(`Server is running on port ${getEnv("PORT")}`);
    });
  } catch (error) {
    logger.error(`Error starting the server ${error}`);
    process.exit(1);
  }
}

main();