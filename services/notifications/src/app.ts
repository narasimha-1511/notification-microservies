import express from "express";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware";
import notificationsRouter from "./routes/notifications.route";
import { register } from "prom-client";
import monitoringMiddleware from "./middlewares/monitoring.middleware";


const app = express();

app.use(compression())
app.use(express.json());
app.use(monitoringMiddleware)
app.get('/metrics' , async (_req , res) => {
    res.setHeader('content-type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
})
app.use(requestLoggerMiddleware);

app.use('/', notificationsRouter);

app.use(errorHandler)

export default app;