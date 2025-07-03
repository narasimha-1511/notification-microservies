import express from "express";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware";
import notificationsRouter from "./routes/notifications.route";


const app = express();

app.use(compression())
app.use(express.json());
app.use(requestLoggerMiddleware);

app.use('/', notificationsRouter);

app.use(errorHandler)

export default app;