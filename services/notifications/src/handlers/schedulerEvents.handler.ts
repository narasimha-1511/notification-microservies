import { getEnv } from "../config/env";
import Notification from "../models/notification.model";
import logger from "../utils/logger";

interface promotionGeneratedMessage {
    id: string;
    name: string;
    content: string;
}

interface recommendationsGeneratedMessage {
    userId: string;
    content: string;
}

//promotion.generated
export const handlePromotionGeneratedEvent = async (message: promotionGeneratedMessage) : Promise<boolean> => {
    return new Promise(async (resolve, _reject) => {
        logger.info(`processing event promotion.generated ${message?.name}`);
        try {
            const { id , name , content } = message;

            //get the users with prferences PROMOTIONS
            const usersResponse = await fetch(`${getEnv("USER_SERVICE_URL")}/allUsers?preferences=PROMOTIONS`);

            const users = await usersResponse.json() as { _id: string }[];

            if(!users || users.length === 0){
                logger.info(`No users found with preferences PROMOTIONS`);
                resolve(true);
                return;
            }

            for(const user of users){
                const userId = user._id;

                const notification = await Notification.create({
                    userId,
                    content: `${name} : ${content}`,
                    type: "PROMOTIONS"
                });

                if(!notification){
                    logger.error(`Error creating promotion notification for user ${userId}`);
                    continue;
                }

                await notification.save();

                logger.info(`Notification created for user ${userId}`);
            }

            resolve(true);
            logger.info(`event promotion.generated processed ${name}`);
        } catch (error) {
            logger.error(`Error handling promotion generated event: ${error}`);
            resolve(false)
        }
    })
}

//recommendations.generated
export const handleRecommendationsGeneratedEvent = async (message: recommendationsGeneratedMessage) : Promise<boolean> => {
    return new Promise(async (resolve, _reject) => {
        logger.info(`processing event recommendations.generated ${message?.userId}`);
        try {
            const { userId, content } = message;

            const notification = await Notification.create({
                userId,
                content,
                type: "RECOMMENDATIONS"
            });

            if(!notification){
                logger.error(`Error creating recommendations notification for user ${userId}`);
                resolve(false);
                return;
            }

            await notification.save();

            logger.info(`Notification created for user ${userId}`);

            resolve(true);
            logger.info(`event recommendations.generated processed ${userId}`);
        } catch (error) {
            logger.error(`Error handling recommendations generated event: ${error}`);
            resolve(false);
        }
    })
}