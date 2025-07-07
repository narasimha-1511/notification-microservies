import winston from "winston";
import { getEnv } from "../config/env";
import LokiTransport from "winston-loki";

const logger = winston.createLogger({
    level: getEnv('NODE_ENV') === "production" ? "info" : "debug",
    defaultMeta: {
        "service" : "notification-service"
    },
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD/MMM/YYYY HH:mm:ss Z'
        }),
        winston.format.errors({
            stack : true
        }),
        winston.format.json(),
        winston.format.splat(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename : "logs/combined.log" }),
        new winston.transports.File({ filename: "logs/error.log" , level: "error" }),
        ...(getEnv("NODE_ENV") === "production" && getEnv("GRAFANA_LOKI_HOST") ? 
        [new LokiTransport({
            host: getEnv("GRAFANA_LOKI_HOST")!,
            labels: {
                "service" : "notifications-service"
            },
        })] : [])
    ]
})

export default logger;