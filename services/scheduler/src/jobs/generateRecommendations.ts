import logger from "../utils/logger"
import { publishEvent } from "../utils/rabbitMq";

export const generateRecommendations = async () => {
    logger.info("Generating recommendations");
    try {

        const usersResponse = await fetch(`${process.env.USER_SERVICE_URL}/allUsers?preferences=RECOMMENDATIONS`);

        if(!usersResponse.ok){
            logger.error(`Error fetching users with preferences RECOMMENDATIONS`);
            return;
        }

        const users = await usersResponse.json() as { _id: string }[];
        const userIds = users.map(user => user._id);

        if(!userIds || userIds.length === 0){
            logger.info("No users found with preferences RECOMMENDATIONS");
            return;
        }

        const generateRecommendationsResponse = await fetch(`${process.env.PRODUCT_SERVICE_URL}/recommendations`, {
            method: "POST",
            body: JSON.stringify({
                userIds
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const recommendations = await generateRecommendationsResponse.json() as { success: boolean, message: string, recommendations: { userId: string, products: string[] }[] };

        if(!recommendations.success){
            logger.error(`Error generating recommendations`);
            return;
        }

        for(const {userId , products} of recommendations.recommendations){
            publishEvent("notifications-exchange", "recommendations.generated", {
                userId,
                content: `Here are the products that are recommended for you: ${products.join(", ")}`
            });

            logger.info(`Recommendations generated for user ${userId}`);
            // push notifications that these are the products that are recommended for the user
        }

        logger.info("Recommendations generated");

    } catch (error) {
        logger.error(`Error generating recommendations: ${error}`);
        throw error;
    }
}