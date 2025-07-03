import { IResolvers } from "@graphql-tools/utils";
import axiosInstance from "../../config/axios";
import { getEnv } from "../../config/env";
import logger from "../../utils/logger";
import { AxiosError } from "axios";

const userServiceUrl = getEnv('USER_SERVICE_URL');

const userResolvers: IResolvers = {
    Mutation: {
        register: async (_, args, _context) => {
            try {
                
                const response = await axiosInstance.post('/register', args.input , {
                    baseURL: userServiceUrl
                });

                return response.data;

            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }

                logger.error('Registration error:' , error);
                return {
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
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }
                logger.error('Login error:', error);
                return {
                    success: false,
                    message: 'Failed to login'
                };
            }
        },
        updatePreferences: async (_, args, context) => {
            try {
                if(!context.user || context.user === null){
                    return {
                        success: false,
                        message: 'Invalid or Expired token'
                    }
                }

                const response = await axiosInstance.put(`/preferences`, args.input, {
                    headers: {
                        'x-user-id': context.user.userId
                    },
                    baseURL: userServiceUrl
                });

                return {
                    success: true,
                    message: 'Preferences updated successfully',
                    updatedPreferences: response.data.updatedPreferences
                }
            } catch (error: any) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return error.response.data;
                    }
                }
                logger.error('Preferences error:', error.response?.data || error.message);
                return {
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

                const response = await axiosInstance.get(`/${context.user.userId}`,
                    {
                        headers: {
                            'x-user-id': context.user.userId
                        },
                        baseURL: userServiceUrl
                    }
                );

                return {
                    success: true,
                    message: 'User fetched successfully',
                    user: response.data.user
                }
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error?.response?.status === 400){
                        return {
                            success: false,
                            message: error?.response?.data?.message || 'Failed to get user'
                        }
                    }
                }
                logger.error('getting user error:' , error);
                return {
                    success: false,
                    message: 'Failed to get user'
                }
            }
        }
    }
};

export default userResolvers;