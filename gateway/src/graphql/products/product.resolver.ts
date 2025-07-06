import { IResolvers } from "@graphql-tools/utils";
import axiosInstance from "../../config/axios";
import { redisClient } from "../../config/redis";
import { getEnv } from "../../config/env";
import logger from "../../utils/logger";

const productServiceUrl = getEnv("PRODUCT_SERVICE_URL");

const invalidateCache = async () => {
    const keys = await redisClient.keys("products:*");
    await Promise.all(keys.map(key => redisClient.del(key)));
    logger.info(`invalidated cache for products`);
}

const productResolvers: IResolvers = {
    Query: {
        getAllProducts: async (_, args, _context) => {
            try {

                const page = parseInt(args.input?.page as string) || 1;
                const limit = parseInt(args.input?.limit as string) || 10;

                const cacheKey = `products:${page}:${limit}`;

                const cachedData = await redisClient.get(cacheKey);

                if(cachedData){
                    logger.info(`Products fetched from cache`);
                    return JSON.parse(cachedData);
                }

                const response = await axiosInstance.get(`/products`, {
                    params: {
                        page,
                        limit
                    },
                    baseURL: productServiceUrl
                });

                const result = response.data;

                await redisClient.setex(cacheKey, 15 * 60 , JSON.stringify(result));

                return result;

            } catch (error) {
                logger.error(`Error fetching products ${error}`);
                throw new Error("Error fetching products");
            }
           
        },
        getProductById: async (_, args, _context) => {
            try {

                const productId = args.id;

                const cacheKey = `product:${productId}`;

                const cachedData = await redisClient.get(cacheKey);

                if(cachedData){
                    logger.info(`Product fetched from cache`);
                    return JSON.parse(cachedData);
                }

                const response = await axiosInstance.get(`/${productId}`, {
                    baseURL: productServiceUrl
                });

                const result = response.data;

                await redisClient.setex(cacheKey, 15 * 60 , JSON.stringify(result));

                return result;

            } catch (error) {
                logger.error(`Error fetching product ${error}`);
                throw new Error("Error fetching product");
            }
        }
    },
    Mutation: {
        addProduct: async (_, args, context) => {
            try {

                const adminKey = context.headers["x-admin-key"];

                if(adminKey !== getEnv("ADMIN_SECRET") || !adminKey){
                    return {
                        success: false,
                        message: "Unauthorized"
                    }
                }

                const response = await axiosInstance.post(`/product`, args.input, {
                    baseURL: productServiceUrl,
                });

                await invalidateCache();

                return response.data;

            } catch (error) {
                logger.error(`Error creating product ${error}`);
                throw new Error("Error creating product");
            }
        }
    }
}

export default productResolvers;