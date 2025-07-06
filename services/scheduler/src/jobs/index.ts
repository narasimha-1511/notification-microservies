import logger from "../utils/logger"
import nodeCron from "node-cron";
import { generatePromotions } from "./generatePromotions";
import { generateRecommendations } from "./generateRecommendations";


export const startScheduler = async () => {
    try {
        
        //promotions every 2 minutes
        nodeCron.schedule("*/2 * * * *", async () => {
            await generatePromotions();
        });

        //recommendations every 10 minutes
        // nodeCron.schedule("*/10 * * * *", async () => {
        //     await generateRecommendations();
        // });

        logger.info("Scheduler started successfully");
    } catch (error) {
        logger.error(`Error starting scheduler: ${error}`);
        process.exit(1);
    }
}