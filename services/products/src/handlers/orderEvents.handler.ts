import Product from "../models/product.model";
import logger from "../utils/logger";
import { publishEvent } from "../utils/rabbitMq";
import mongoose from "mongoose";

interface orderPlacedMessage {
    orderId: string;
    userId: string;
    products: {
        id: string;
        quantity: number;
    }[];
}

// order.placed
export const handleOrderPlacedEvent = async (message: orderPlacedMessage) : Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { orderId, userId, products } = message;
            logger.info(`processing event: order.placed for order ${orderId} for user ${userId}`);

            for(const _product of products){
                const product = await Product.findOne({ _id: _product.id });

                if(!product || product.quantity < _product.quantity){
                    if(!product || product == null){
                        logger.warn(`product ${_product.id} not found`);
                        continue;
                    }
                    if(product.quantity < _product.quantity){
                        logger.warn(`product ${_product.id} not enough quantity`);
                        logger.info(`publishing event: order.product.out_of_stock for order ${orderId} for user ${userId}`);
                        await publishEvent("orders-exchange", "order.product.out_of_stock", {
                            orderId: orderId,
                            productId: _product.id,
                            quantity: _product.quantity,
                            userId: userId
                        });
                        return resolve(true);
                    }
                }

                product.quantity -= _product.quantity;
                await product.save();
            }

            logger.info(`publishing event: order.product.stock_updated for order ${orderId} for user ${userId}`);
            await publishEvent("orders-exchange", "order.product.stock_updated", { orderId, userId });

            logger.info(`processed event: order.placed for order ${orderId} for user ${userId} successfully`);
            return resolve(true);
        } catch (error) {
            logger.error(`Error in processing order ${message.orderId} for user ${message.userId}: ${error}`);
            resolve(false);
        }
    });
}