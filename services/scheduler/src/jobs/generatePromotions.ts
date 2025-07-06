import { promotionsMock } from "../constants/promotionsMock";
import logger from "../utils/logger"
import { publishEvent } from "../utils/rabbitMq";

export const generatePromotions = async () => {
    logger.info("Generating promotions");
    try {
        const promotions = promotionsMock;

        //getting 1 random promotion
        const randomPromotion = promotions[Math.floor(Math.random() * promotions.length)];

        await publishEvent("notifications-exchange", "promotion.generated", randomPromotion);

        logger.info(`Promotion ${randomPromotion.name} published`);
    } catch (error) {
        logger.error(`Error generating promotions: ${error}`);
        throw error;
    }
}