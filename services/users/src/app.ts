import express from "express";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware";
import errorHandler from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import compression from "compression";
import { register } from "prom-client";
import monitoringMiddleware from "./middlewares/monitoring.middleware";

const app = express();

app.use(express.json())
app.use(compression())
app.use(monitoringMiddleware)
app.get('/metrics' , async (_req , res) => {
    res.setHeader('content-type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
})
app.use(requestLoggerMiddleware)


app.use('/' , userRoutes)

app.use(errorHandler);

export default app