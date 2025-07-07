import { startScheduler } from "./jobs";
import logger from "./utils/logger";
import { connectToRabbitMq } from "./utils/rabbitMq";


const main = async () => {
    try {
        await connectToRabbitMq(["notifications-exchange"]);
        await startScheduler();
        logger.info("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
        logger.error("Scheduler started");
    } catch (error) {
        logger.error(`Error starting scheduler: ${error}`);
        process.exit(1);
    }
}

main();