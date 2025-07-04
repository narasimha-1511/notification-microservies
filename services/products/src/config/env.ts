import { config } from "dotenv";
import { z } from "zod";
config();

const envSchema = z.object({
    PORT: z.string().default('3003'),
    NODE_ENV: z.enum(['development','production']),
    MONGO_URI: z.string(),
    RABBITMQ_URL: z.string().url(),
    RABBITMQ_EXCHANGE: z.string()
});


const parsedEnv = envSchema.safeParse(process.env);
if(!parsedEnv.success){
    console.error(`Invalid Env Variables` , parsedEnv.error.format())
    throw new Error(`Invalid Env Variables `);
}

type Env = z.infer<typeof envSchema>;
const env: Env = parsedEnv.data;

export const getEnv = (key: keyof Env) => env[key]; 