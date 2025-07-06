import app from "./app";
import connectDB from "./config/db";
import { getEnv } from "./config/env";
import logger from "./utils/logger";
import { connectToRabbitMq } from "./utils/rabbitMq";
import handlers from "./handlers";

const main = async () => {
  try {
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