import { Request, Response } from "express";
import logger from "../utils/logger";
import Order from "../models/orders.model";
import { getEnv } from "../config/env";
import { publishEvent } from "../utils/rabbitMq";

export const placeOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const { products } = req.body as { products: { id: string, quantity: number }[] };
        const userId = req.headers['x-user-id'] as string;

        if(!userId){
            logger.warn(`attempted to place order without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const productsMap = new Map<string, number>();

        for(const product of products){
            productsMap.set(product.id, product.quantity);
        }

        const productServiceUrl = getEnv("PRODUCT_SERVICE_URL");

        const response = await fetch(`${productServiceUrl}/productsByIds?ids=${Array.from(productsMap.keys()).join(",")}`);

        const productsData = await response.json();

        if(!productsData.success){
            logger.error(`Error fetching products from product service`);
            return res.status(400).json({
                success: false,
                message: "Error fetching products from product service"
            });
        }

        // for(const product of productsData.products){
        //     const quantity = productsMap.get(product.id);
        //     if(!quantity || quantity > product.quantity){
        //         logger.error(`Insufficient quantity for product ${product.id}`);
        //         return res.status(400).json({
        //             success: false,
        //             message: `Insufficient quantity for product ${product.id}`
        //         });
        //     }
        // }

        const order = await Order.create({
            userId,
            products,
            status: "PENDING"
        });

        await publishEvent("order.placed", {
            orderId: order._id,
            userId,
            products: order.products
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: {
                id: order._id,
                products: order.products,
                status: order.status,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        logger.error(`Error placing order: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getOrderById = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.headers['x-user-id'];

        if(!userId){
            logger.warn(`attempted to get order without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const { id } = req.params;
        const order = await Order.findOne({ _id: id, userId });

        if(!order){
            logger.warn(`order ${id} not found for user ${userId}`);
            return res.status(404).json({
                success: false,
                message: "Order not found for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order: {
                id: order._id,
                products: order.products,
                status: order.status,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        logger.error(`Error getting order: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getAllOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.headers['x-user-id'];

        if(!userId){
            logger.warn(`attempted to get all orders without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments({ userId });

        const result = {
            orders: orders.map((order) => ({
                id: order._id,
                products: order.products,
                status: order.status,
                createdAt: order.createdAt
            })),
            totalOrders: totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            limit: limit
        }
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            result
        });

    } catch (error) {
        logger.error(`Error getting all orders: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findOne({ _id: id });

        if(!order){
            logger.warn(`order ${id} not found`);
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        await publishEvent("order.status.updated", {
            orderId: order._id,
            userId: order.userId,
            status: order.status
        });

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: {
                id: order._id,
                products: order.products,
                status: order.status,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        logger.error(`Error updating order status: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}