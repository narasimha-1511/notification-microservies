import Order from "../models/orders.model";
import logger from "../utils/logger";
import { publishEvent } from "../utils/rabbitMq";

//order.product.stock_updated
interface productsQuantityUpdatedMessage {
    orderId: string;
    userId: string;
}

interface productsOutOfStockMessage {
    orderId: string;
    productId: string;
    quantity: number;
    userId: string;
}

//order.product.stock_updated
export const handleProductsQuantityUpdatedEvent = async (message: productsQuantityUpdatedMessage) : Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
 
        try {
            const { orderId, userId } = message;
            logger.info(`processing order.product.stock_updated for order ${orderId} for user ${userId}`);

            const order = await Order.findOne({ _id: orderId });

            if(!order){
                logger.warn(`order ${orderId} not found`);
                return false;
            }

            order.status = "SHIPPED";
            await order.save();

            await publishEvent("orders-exchange", "order.status_updated", { orderId, userId, status: "SHIPPED" });
            logger.info(`order.status_updated event published for order ${orderId}`);

            logger.info(`order.product.stock_updated processed successfully for order ${orderId}`);
            resolve(true);
        } catch (error) {
            logger.error(`Error in processing event: order.product.stock_updated for order ${message.orderId} for user ${message.userId}: ${error}`);
            reject(error);
        }
    });
}

// order.product.out_of_stock
export const handleProductsOutOfStockEvent = async (message: productsOutOfStockMessage) : Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            logger.info(`processing order.product.out_of_stock for order ${message.orderId} for user ${message.userId}`);
            const { orderId, productId, quantity, userId } = message;

            const order = await Order.findOne({ _id: orderId });

            if(!order){
                logger.warn(`order ${orderId} not found`);
                return false;
            }

            order.status = "CANCELLED";
            await order.save();

            logger.info(`publishing event: order.status_updated for order ${orderId} for user ${userId}`);
            await publishEvent("orders-exchange", "order.status_updated", { orderId, userId, status: "CANCELLED" , reason: `Product ${productId} is out of stock` });

            logger.info(`order.product.out_of_stock processed successfully for order ${orderId} for user ${userId}`);
            resolve(true);
        } catch (error) {
            logger.error(`Error in processing event: order.product.out_of_stock for order ${message.orderId} for user ${message.userId}: ${error}`);
            reject(error);
        }
    });
}