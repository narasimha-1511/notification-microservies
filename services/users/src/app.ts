import express from "express";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware";
import errorHandler from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import compression from "compression";
import resTime from "response-time"
import client , { register } from "prom-client";
import monitoringMiddleware from "./config/monitoring";

const app = express();

app.use(express.json())
app.use(compression())
app.use(requestLoggerMiddleware)
app.get('/metrics' , async (_req , res) => {
    res.setHeader('content-type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
})
app.use(monitoringMiddleware)


app.use('/' , userRoutes)

app.use(errorHandler);

export default app