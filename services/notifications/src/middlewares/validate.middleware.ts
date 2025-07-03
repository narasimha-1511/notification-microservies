import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import logger from "../utils/logger";

const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                logger.warn(`Validation error: at ${req.path}`);
                // customizing to better error messages
                const messages = result.error.issues.map(
                    (issue) => `"${issue.path.join('.')}" ${issue.message}`
                );
                res.status(400).json({
                    message: messages.join(', '),
                    success: false,
                });
                return;
            }
            next();
        } catch (error) {
            res.status(400).json({
                message: "Validation error",
                success: false,
            });
        }
    }
}

export default validate;