import express from "express";
import compression from "compression";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware";
import errorHandler from "./middlewares/error.middleware";
import productsRouter from "./routes/products.route";

const app = express();

app.use(express.json());
app.use(compression());
app.use(requestLoggerMiddleware);

app.use("/", productsRouter)

app.use(errorHandler);

export default app;
