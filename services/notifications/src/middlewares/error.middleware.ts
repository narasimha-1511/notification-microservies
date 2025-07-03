import { Request , Response , NextFunction, ErrorRequestHandler } from "express";
import { getEnv } from "../config/env";
import logger from "../utils/logger";

const errorHandler: ErrorRequestHandler  = (err: any , req: Request , res: Response , _next: NextFunction) => {
    logger.error(`error handling ${req.url} : ${err.stack}`);
    res.status(500).json({
        succes: false,
        message: err.message || 'Internal Server error',
       ...(getEnv("NODE_ENV") === "development" && { stack: err.stack }) 
    })
}

export default errorHandler;