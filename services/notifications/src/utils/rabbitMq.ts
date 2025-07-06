import amqp from "amqplib";
import logger from "./logger";
import { getEnv } from "../config/env";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export const consumeEvent = async (exchange: string, key: string, callback: (message: any) => Promise<boolean>) => {
    try {
        if(!channel){
            await connectToRabbitMq([exchange]);
        }

        const queue = await channel?.assertQueue(`notifications-queue-${key}`, { durable: true });
        await channel?.bindQueue(queue?.queue as string , exchange, key);

        channel?.consume(queue?.queue as string, async (message) => {
            try {
                if(message !== null) {
                    const content = JSON.parse(message.content.toString());
                    const result = await callback(content);
                    if(result){
                        channel?.ack(message);
                    }
                }
            } catch (error) {
                logger.error(`Error consuming event: ${key} with message ${message?.content.toString()} ${error}`);
                throw error;
            }
            
        });

    } catch (error) {
        logger.error(`Error consuming event: ${key} ${error}`);
        throw error;
    }
};

export const connectToRabbitMq = async (exchanges: string[]) => {
    try {
        
        if(connection){
            return;
        }

        connection = await amqp.connect(getEnv("RABBITMQ_URL"));
        channel = await connection.createChannel();

        for(const exchange of exchanges){
            await channel.assertExchange(exchange, "topic", { durable: true });
        }

        logger.info("Connected to RabbitMQ");

    } catch (error) {
        logger.error(`Error connecting to RabbitMQ: ${error}`);
        throw error;
    }
}

export const publishEvent = async (exchange: string, key: string, message: any) => {
    try {
        if(!channel){
            await connectToRabbitMq([exchange]);
        }

        channel?.publish(exchange, key, Buffer.from(JSON.stringify(message)));

        logger.info(`Event published to ${key}`);

    } catch (error) {
        logger.error(`Error publishing event: ${key} ${error}`);
        throw error;
    }
}