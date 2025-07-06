import { IResolvers } from "@graphql-tools/utils";
import axiosInstance from "../../config/axios";
import { getEnv } from "../../config/env";
import logger from "../../utils/logger";
import { AxiosError } from "axios";
import { redisClient } from "../../config/redis";

const notificationServiceUrl = getEnv('NOTIFICATION_SERVICE_URL');

const InvalidateCache = async (userId: string) => {
    let keys = await redisClient.keys(`notifications:*:${userId}:*`);
    logger.info(`Invalidating cache for user ${userId}`);
    for(const key of keys){
        await redisClient.del(key);
    }
}

const notificationResolvers: IResolvers = {
    Mutation: {
        postNotification: async (_, args, context) => {
            try {
                if(!context.user || context.user === null){
                    return {
                        success: false,
                        message: "Invalid or Expired token"
                    }
                }

                const response = await axiosInstance.post('/postNotification', args.input, {
                    baseURL: notificationServiceUrl,
                    headers: {
                        'x-user-id': context.user.userId
                    }
                });

                await InvalidateCache(context.user.userId);

                return response.data;
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }

                logger.error(`Error posting notification: ${error}`);
                return {
                    success: false,
                    message: "Error posting notification"
                }
            }
        },
        markAsRead: async (_, args, context) => {
            try {
                if(!context.user || context.user === null){
                    return {
                        success: false,
                        message: "Invalid or Expired token"
                    }
                }

                const response = await axiosInstance.put(`/markAsRead/${args.id}`,{}, {
                    baseURL: notificationServiceUrl,
                    headers: {
                        'x-user-id': context.user.userId
                    }
                });

                await InvalidateCache(context.user.userId);

                return response.data;
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }

                logger.error(`Error marking notification as read: ${error}`);
                return {
                    success: false,
                    message: "Error marking notification as read"
                }
            }
        }
    },
    Query: {
        unreadNotifications: async (_, args, context) => {
            try {
                if(!context.user || context.user === null){
                    return {
                        success: false,
                        message: "Invalid or Expired token"
                    }
                }

                const cacheKey = `notifications:unread:${args.input?.userId}:${args.input?.page}:${args.input?.limit}`;
                const cachedData = await redisClient.get(cacheKey);
                // if(cachedData){
                //     logger.info(`Returning cached data for unread notifications`);
                //     return JSON.parse(cachedData);
                // }

                const response = await axiosInstance.get(`/notifications`, {
                    baseURL: notificationServiceUrl,
                    headers: {
                        'x-user-id': context.user.userId
                    },
                    params: {
                        read: false,
                        page: args.input?.page,
                        limit: args.input?.limit
                    }
                });

                const result = response.data;

                redisClient.setex(cacheKey, 900, JSON.stringify(result));

                return result;
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }

                logger.error(`Error getting unread notifications: ${error}`);
                return {
                    success: false,
                    message: "Error getting unread notifications"
                }
            }
        },
        readNotifications: async (_, args, context) => {
            try {
                if(!context.user || context.user === null){
                    return {
                        success: false,
                        message: "Invalid or Expired token"
                    }
                }

                const cacheKey = `notifications:read:${args.input?.userId}:${args.input?.page}:${args.input?.limit}`;
                const cachedData = await redisClient.get(cacheKey);
                if(cachedData){
                    logger.info(`Returning cached data for read notifications`);
                    return JSON.parse(cachedData);
                }

                const response = await axiosInstance.get(`/notifications`, {
                    baseURL: notificationServiceUrl,
                    headers: {
                        'x-user-id': context.user.userId
                    },
                    params: {
                        read: true,
                        page: args.input?.page,
                        limit: args.input?.limit
                    }
                });

                const result = response.data;

                redisClient.setex(cacheKey, 900, JSON.stringify(result));

                return result;
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }
            }
        },
        getNotificationById: async (_, args, context) => {
            try {

                if(!context.user || context.user === null){
                    return {
                        success: false,
                        message: "Invalid or Expired token"
                    }
                }

                const cacheKey = `notification:${args.id}`;
                const cachedData = await redisClient.get(cacheKey);
                if(cachedData){
                    logger.info(`Returning cached data for notification by ${args.id}`);
                    return JSON.parse(cachedData);
                }

                const response = await axiosInstance.get(`/notification/${args.id}`, {
                    baseURL: notificationServiceUrl,
                    headers: {
                        'x-user-id': context.user.userId
                    }
                });

                const result = response.data;

                redisClient.setex(cacheKey, 900, JSON.stringify(result));

                return result;
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }

                logger.error(`Error getting notification by id: ${error}`);
                return {
                    success: false,
                    message: "Error getting notification by id"
                }
            }
        }
    }
}

export default notificationResolvers;