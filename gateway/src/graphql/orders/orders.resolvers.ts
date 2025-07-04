import { IResolvers } from "@graphql-tools/utils";
import { getEnv } from "../../config/env";
import axiosInstance from "../../config/axios";
import logger from "../../utils/logger";
import { AxiosError } from "axios";

const orderServiceUrl = getEnv("ORDER_SERVICE_URL");

const ordersResolvers : IResolvers = {
    Mutation: {
        placeOrder: async (_, { products }, context) => {

            try {
                if(!context.user){
                    return {
                        success: false,
                        message: "Invalid or Expired Token"
                    }
                }
    
                const response = await axiosInstance.post(`/order`, {
                    products
                }, {
                    headers: {
                        "x-user-id": context.user.userId
                    },
                    baseURL: orderServiceUrl
                });
    
                return response.data;
            } catch (error) {
                logger.error(`Error placing order: ${error}`);
                if (error instanceof AxiosError) {
                    return {
                        success: false,
                        message: error.response?.data?.message || "Error placing order"
                    }
                }
                return {
                    success: false,
                    message: "Error placing order"
                }
            }
        },
        updateOrderStatus: async (_, { id, status }, context) => {
            try {
                const adminSecret = context.headers["x-admin-key"];

                if(!adminSecret || adminSecret !== getEnv("ADMIN_SECRET")){
                    return {
                        success: false,
                        message: "Invalid Admin Secret"
                    }
                }

                const response = await axiosInstance.put(`/order/${id}`, {
                    status
                }, {
                    baseURL: orderServiceUrl
                });

                return response.data;
            } catch (error) {
                logger.error(`Error updating order status: ${error}`);
                if (error instanceof AxiosError) {
                    return {
                        success: false,
                        message: error.response?.data?.message || "Error updating order status"
                    }
                }
                return {
                    success: false,
                    message: "Error updating order status"
                }
            }
        }
    },
    Query: {
        getOrderById: async (_, { id } , context) => {
            try {
                if(!context.user){
                    return {
                        success: false,
                        message: "Invalid or Expired Token"
                    }
                }

                const response = await axiosInstance.get(`/order/${id}`, {
                    headers: {
                        "x-user-id": context.user.userId
                    },
                    baseURL: orderServiceUrl
                });

                return response.data;
            } catch (error) {
                logger.error(`Error getting order: ${error}`);
                if (error instanceof AxiosError) {
                    return {
                        success: false,
                        message: error.response?.data?.message || "Error getting order"
                    }
                }
                return {
                    success: false,
                    message: "Error getting order"
                }
            }
        },
        getAllOrders: async (_, { page, limit } , context) => {
            try {
                if(!context.user){
                    return {
                        success: false,
                        message: "Invalid or Expired Token"
                    }
                }

                const response = await axiosInstance.get(`/orders`, {
                    headers: {
                        "x-user-id": context.user.userId
                    },
                    baseURL: orderServiceUrl,
                    params: {
                        page,
                        limit
                    }
                });

                return response.data;
            } catch (error) {
                logger.error(`Error getting all orders: ${error}`);
                if (error instanceof AxiosError) {
                    return {
                        success: false,
                        message: error.response?.data?.message || "Error getting all orders"
                    }
                }
                return {
                    success: false,
                    message: "Error getting all orders"
                }
            }
        }
    }
}

export default ordersResolvers;