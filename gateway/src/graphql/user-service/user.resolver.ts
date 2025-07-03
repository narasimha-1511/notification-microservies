import { IResolvers } from "@graphql-tools/utils";
import axiosInstance from "../../config/axios";
import { getEnv } from "../../config/env";
import logger from "../../utils/logger";
import axios, { AxiosError } from "axios";

const userServiceUrl = getEnv('USER_SERVICE_URL');

const userResolvers: IResolvers = {
    Mutation: {
        register: async (_, args, _context) => {
            try {
                
                const response = await axiosInstance.post('/register', args.input , {
                    baseURL: userServiceUrl
                });

                return response.data;

            } catch (error: any) {
                logger.error('Registration error:' , error?.response?.data || error?.message);
                return error?.response?.data || {
                    success: false,
                    message: 'Failed to register user'
                }
            }
        },
        login: async (_, args, _context) => {
            try {
                const response = await axiosInstance.post('/login', args.input, {
                    baseURL: userServiceUrl
                });
                return response.data;
            } catch (error: any) {
                logger.error('Login error:', error.response?.data || error.message);
                return error.response?.data || {
                    success: false,
                    message: 'Failed to login'
                };
            }
        },
        updatePreferences: async (_, args, context) => {
            try {
                if(!context.user || context.user === null || context.user === undefined){
                    return {
                        success: false,
                        message: 'Invalid or Expired token'
                    }
                }

                const response = await axiosInstance.put(`/user/${context.user.userId}/preferences`, args.input, {
                    baseURL: userServiceUrl
                });

                return {
                    success: true,
                    message: 'Preferences updated successfully',
                    updatedPreferences: response.data.updatedPreferences
                }
            } catch (error: any) {
                logger.error('Preferences error:', error.response?.data || error.message);
                return error.response?.data || {
                    success: false,
                    message: 'Failed to update preferences'
                }
            }
        }
    },
    Query: {
        user: async (_, args, context) => {
            try{
                if(!context.user){
                    return {
                        success: false,
                        message: 'Invalid or Expired token'
                    }
                }

                const response = await axiosInstance.get(`/user/${context.user.userId}`, {
                    baseURL: userServiceUrl
                });

                return {
                    success: true,
                    message: 'User fetched successfully',
                    user: response.data.user
                }
            } catch (error: any) {
                logger.error('User error:' , error?.response?.data || error?.message);
                return error?.response?.data || {
                    success: false,
                    message: 'Failed to get user'
                }
            }
        }
    }
};

export default userResolvers;