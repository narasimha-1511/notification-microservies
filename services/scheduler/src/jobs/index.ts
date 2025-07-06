import logger from "../utils/logger"
import nodeCron from "node-cron";
import { generatePromotions } from "./generatePromotions";
import { generateRecommendations } from "./generateRecommendations";


export const startScheduler = async () => {
    try {
        
        nodeCron.schedule("* */24 * * *", async () => {
            await generatePromotions();
            await generateRecommendations();
        });
 
        logger.info("Scheduler started successfully");
    } catch (error) {
        logger.error(`Error starting scheduler: ${error}`);
        process.exit(1);
    }
}