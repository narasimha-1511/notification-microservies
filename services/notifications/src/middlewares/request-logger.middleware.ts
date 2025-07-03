import morgan from "morgan"
import logger from "../utils/logger";

const requestLoggerMiddleware = morgan(
    'dev'
    ,{ 
        stream: {
            write: (message : string ) => {
                logger.http(message.trim())
            }
        }
    }
)

export default requestLoggerMiddleware