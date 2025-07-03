import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"
import logger , {loggerMiddleware} from "./utils/logger";
import { getEnv } from "./config/env";
import jwt from "jsonwebtoken";
import { Schema } from "./graphql/index";
import compression from "compression";

const app = express();
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(compression() as unknown as express.RequestHandler);

async function startGraphQlServer( app: express.Application ){

    const server = new ApolloServer({schema: Schema});

    await server.start();
    
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }: { req: express.Request }) => {
            const token = req.headers.authorization?.split(" ")[1];

            if(!token){
                return { user: null };
            }
            try{
                const decoded = jwt.verify(token, getEnv('JWT_SECRET')) as {
                    userId: string,
                    email: string
                };
                return { user: decoded };
            }catch(error){
                logger.warn(`Invalid or expired token ${error}`);
                return { user: null };
            }
        },
    }));
    
}

export { startGraphQlServer , app }
