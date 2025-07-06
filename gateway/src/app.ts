import express from "express";
import cors from "cors";
import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"
import logger  from "./utils/logger";
import { getEnv } from "./config/env";
import jwt from "jsonwebtoken";
import { Schema } from "./graphql/index";
import compression from "compression";
import { register } from "prom-client";

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression() as unknown as express.RequestHandler);
app.get('/metrics' , async (_req , res) => {
    //setting prometheus
    res.setHeader('content-type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
})

const requestLoggerPlugIn :ApolloServerPlugin = {
    async requestDidStart() {
        const startTime = Date.now();
        return {
            async willSendResponse(requestContext) {
                const endTime = Date.now();
                const duration = endTime - startTime;
                logger.info(`/${requestContext.request.operationName}  ${duration}ms -`);
            }
        }
    }
}

async function startGraphQlServer( app: express.Application ){

    const server = new ApolloServer({schema: Schema , plugins: [requestLoggerPlugIn]});

    await server.start();
    
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }: { req: express.Request }) : Promise<{ user: { userId: string, email: string } | null , headers: any }> => {
            const token = req.headers["authorization"]?.split(" ")[1];

            if(!token){
                return { user: null , headers: req.headers };
            }
            try{
                const decoded = await jwt.verify(token, getEnv('JWT_SECRET')) as {
                    userId: string,
                    email: string
                };
                return { user: decoded , headers: req.headers };
            }catch(error){
                logger.warn(`Invalid or expired token ${error}`);
                return { user: null , headers: req.headers };
            }
        },
    }));
    
}

export { startGraphQlServer , app }
