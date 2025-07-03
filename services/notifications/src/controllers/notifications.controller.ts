import { Request , Response } from "express"
import logger from "../utils/logger"
import Notification from "../models/notification.model";

export const postNotification = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const userId = req.headers['x-user-id'] as string;

        if(!userId){
            logger.warn(`attempted to post notification without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const { type, content } = req.body;

        const notification = await Notification.create({
            type,
            content,
            userId
        });

        res.status(201).json({
            success: true,
            message: "Notification posted successfully",
            notification: {
                id: notification._id,
                type: notification.type,
                content: notification.content,
                read: notification.read,
                sentAt: notification.sentAt
            }
        });

    } catch (error) {
        logger.error(`Error posting notification: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const markAsRead = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if(!userId){
            logger.warn(`attempted to mark notification as read without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate({ _id: id, userId }, { read: true });

        if(!notification){
            return res.status(404).json({
                success: false,
                message: "Notification not found or does not belong to the user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });

    } catch (error) {
        logger.error(`Error marking notification as read: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getNotifications = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if(!userId){
            logger.warn(`attempted to get notifications without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const read = req.query?.read === 'true' ? true : false;

        const notifications = await Notification.find({ userId, read: read })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ sentAt: -1 });

        const total = await Notification.countDocuments({ userId, read: read });

        const result = {
            notifications: notifications.map((notification) => ({
                id: notification._id,
                type: notification.type,
                content: notification.content,
                read: notification.read,
                sentAt: notification.sentAt
            })),
            totalNotifications: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit: limit
        }

        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            result
        });
    } catch (error) {
        logger.error(`Error getting notifications: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getNotificationById = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if(!userId){
            logger.warn(`attempted to get notification by id without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const { id } = req.params;

        const notification = await Notification.findOne({ _id: id, userId });

        if(!notification){
            return res.status(404).json({
                success: false,
                message: "Notification not found or does not belong to the user"
            });
        }   

        res.status(200).json({
            success: true,
            message: "Notification fetched successfully",
            notification: {
                id: notification._id,
                type: notification.type,
                content: notification.content,
                read: notification.read,
                sentAt: notification.sentAt
            }
        });
    } catch (error) {
        logger.error(`Error getting notification by id: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}