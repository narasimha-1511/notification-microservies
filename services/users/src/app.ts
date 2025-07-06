import express from "express";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware";
import errorHandler from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import compression from "compression";

const app = express();

app.use(express.json())
app.use(compression())
app.use(requestLoggerMiddleware)

app.use('/' , userRoutes)

app.use(errorHandler);

export default app