import { config } from "dotenv";
import { z } from "zod";
config();

const envSchema = z.object({
    PORT: z.string().default('3003'),
    NODE_ENV: z.enum(['development','production']),
    MONGO_URI: z.string(),
    RABBITMQ_URL: z.string().url(),
    ORDERS_SERVICE_URL: z.string().url(),
    GRAFANA_LOKI_HOST: z.string().url().optional(),
});


const parsedEnv = envSchema.safeParse(process.env);
if(!parsedEnv.success){
    console.error(`Invalid Env Variables` , parsedEnv.error.format())
    throw new Error(`Invalid Env Variables `);
}

type Env = z.infer<typeof envSchema>;
const env: Env = parsedEnv.data;

export const getEnv = <K extends keyof Env>(key: K): Env[K] => env[key]; 