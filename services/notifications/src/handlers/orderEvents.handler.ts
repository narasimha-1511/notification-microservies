import Notification from "../models/notification.model";
import logger from "../utils/logger";

//order.placed
interface orderPlacedMessage {
    orderId: string;
    userId: string;
    products: {
        id: string;
        quantity: number;
    }[];
}

//order.status_updated
interface orderStatusUpdatedMessage {
    orderId: string;
    userId: string;
    status: string;
    reason?: string;
}

//order.placed
export const handleOrderPlacedEvent = async (message: orderPlacedMessage) : Promise<boolean> => {
    return new Promise(async (resolve, _reject) => {
        logger.info(`processing event: order.placed for order ${message.orderId} for user ${message.userId}`);
        try {
            const { orderId, userId, products } = message;
            logger.info(`processing event: order.placed for order ${orderId} for user ${userId}`);

            const notification = await Notification.create({
                userId: userId,
                content: `Order ${orderId} has been placed`,
                type: "ORDER_UPDATES",
            });

            await notification.save();
            logger.info(`notification published for order ${orderId} for user ${userId}`);
            logger.info(`processed: order.placed notification for order ${orderId} for user ${userId}`);
            return resolve(true);
        } catch (error) {
            logger.error(`error processing event: order.placed for order ${message.orderId} for user ${message.userId}`);
            return resolve(false)
        }
    });
}

//order.status_updated
export const handleOrderStatusUpdatedEvent = async (message: orderStatusUpdatedMessage) : Promise<boolean> => {
    return new Promise(async (resolve, _reject) => {
        logger.info(`processing event: order.status_updated for order ${message.orderId} for user ${message.userId}`);
        try {
            const { orderId, userId, status, reason } = message;
            logger.info(`processing event: order.status_updated for order ${orderId} for user ${userId}`);

            const notification = await Notification.create({
                userId: userId,
                content: `Order ${orderId} has been updated to ${status} ${reason ? `due to : ${reason}` : ""}`,
                type: "ORDER_UPDATES",
            });

            await notification.save();
            logger.info(`notification published for order ${orderId} for user ${userId}`);
            logger.info(`processed: order.status_updated notification for order ${orderId} for user ${userId}`);
            return resolve(true);
        } catch (error) {
            logger.error(`error processing event: order.status_updated for order ${message.orderId} for user ${message.userId}`);
            return resolve(false);
        }
    });
}



