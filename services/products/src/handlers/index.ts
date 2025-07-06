import { handleOrderPlacedEvent } from "./orderEvents.handler";
import { consumeEvent } from "../utils/rabbitMq";
import logger from "../utils/logger";

const handlers = async () => {
    try {
        await consumeEvent( "orders-exchange" , "order.placed" , handleOrderPlacedEvent);
    } catch (error) {
        logger.error(`Error in handlers: ${error}`);
        process.exit(1);
    }
}

export default handlers;