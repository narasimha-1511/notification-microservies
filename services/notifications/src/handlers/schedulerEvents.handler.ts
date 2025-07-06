import logger from "../utils/logger";

interface promotionGeneratedMessage {
    promotion: {
        id: string;
        name: string;
        content: string;
    }
}

export const handlePromotionGeneratedEvent = async (message: promotionGeneratedMessage) : Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            const { promotion } = message;
            logger.info(`Promotion ${promotion.name} generated`);
            resolve(true);
        } catch (error) {
            logger.error(`Error handling promotion generated event: ${error}`);
            reject(error);
        }
    })
}