import { handleProductsOutOfStockEvent, handleProductsQuantityUpdatedEvent } from "./productEvents.handler";
import { consumeEvent } from "../utils/rabbitMq";
import logger from "../utils/logger";

const handlers = async () => {
    try {
        await consumeEvent( "orders-exchange" , "order.product.stock_updated" , handleProductsQuantityUpdatedEvent);
        await consumeEvent( "orders-exchange" , "order.product.out_of_stock" , handleProductsOutOfStockEvent);
    } catch (error) {
        logger.error(`Error in handlers: ${error}`);
        process.exit(1);
    }
}

export default handlers;