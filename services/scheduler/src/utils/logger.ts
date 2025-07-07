import { config } from "dotenv";
import winston from "winston";
import LokiTransport from "winston-loki";
config();

if (process.env.NODE_ENV === "production" && !process.env.GRAFANA_LOKI_HOST) {
    throw new Error("GRAFANA_LOKI_HOST must be set in production");
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    defaultMeta: {
        "service" : "scheduler-service"
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
        ...(process.env.NODE_ENV === "production" && process.env.GRAFANA_LOKI_HOST ? 
        [new LokiTransport({
            host: process.env.GRAFANA_LOKI_HOST!,
            labels: {
                "service" : "scheduler-service"
            },
        })] : [])
    ]
})

export default logger;