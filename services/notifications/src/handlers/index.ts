import { handleOrderPlacedEvent, handleOrderStatusUpdatedEvent } from "./orderEvents.handler";
import { consumeEvent } from "../utils/rabbitMq";
import logger from "../utils/logger";
import { handlePromotionGeneratedEvent , handleRecommendationsGeneratedEvent } from "./schedulerEvents.handler";

const handlers = async () => {
    try {
        await consumeEvent( "orders-exchange" , "order.placed" , handleOrderPlacedEvent);
        await consumeEvent( "orders-exchange" , "order.status_updated" , handleOrderStatusUpdatedEvent);
        await consumeEvent( "notifications-exchange" , "promotion.generated" , handlePromotionGeneratedEvent);
        await consumeEvent( "notifications-exchange" , "recommendations.generated" , handleRecommendationsGeneratedEvent);
    } catch (error) {
        logger.error(`Error in handlers: ${error}`);
        process.exit(1);
    }
}

export default handlers;