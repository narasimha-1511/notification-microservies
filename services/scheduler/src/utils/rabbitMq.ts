import amqp from "amqplib";
import logger from "./logger";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export const consumeEvent = async (key: string, callback: (message: amqp.Message) => void) => {
    try {
        if(!channel){
            await connectToRabbitMq();
        }

        const queue = await channel?.assertQueue("scheduler-queue", { durable: true });
        await channel?.bindQueue(queue?.queue as string , process.env.RABBITMQ_EXCHANGE as string, key);

        channel?.consume(queue?.queue as string, (message) => {
            try {
                if(message !== null) {
                    const content = JSON.parse(message.content.toString());
                    callback(content);
                    channel?.ack(message);
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

export const connectToRabbitMq = async () => {
    try {
        
        if(connection){
            return;
        }

        connection = await amqp.connect(process.env.RABBITMQ_URL as string);
        channel = await connection.createChannel();

        await channel.assertExchange(process.env.RABBITMQ_EXCHANGE as string, "topic", { durable: true });

        logger.info("Connected to RabbitMQ");

    } catch (error) {
        logger.error(`Error connecting to RabbitMQ: ${error}`);
        throw error;
    }
}