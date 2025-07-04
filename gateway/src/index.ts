import { startGraphQlServer , app } from "./app";
import { getEnv } from "./config/env";
import { redisClient } from "./config/redis";
import logger from "./utils/logger";

const main = async () => {
    try{
        await redisClient.connect();
        await startGraphQlServer(app);
        app.listen(getEnv('PORT'), () => {
            logger.info(`Server is running on port ${getEnv('PORT')}`);
        });
    }catch(error){
        logger.error(`error Starting Server ${error}`);
        process.exit(1);
    }
}

main();