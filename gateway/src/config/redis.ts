import Redis from "ioredis";
import { getEnv } from "./env";
import logger from "../utils/logger";

const redisClient = new Redis(getEnv("REDIS_URL") , {
    lazyConnect: true
}).on("connect", () => {
    logger.info("Connected to Redis");
}).on("error", (error) => {
    logger.error(`Error connecting to Redis: ${error}`);
}).on("close", () => {
    logger.info("Redis connection closed");
});

export { redisClient}