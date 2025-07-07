import { Request, Response } from "express";
import client from "prom-client";
import responseTime from "response-time";

export const requestsTimeMetrics = new client.Histogram({
    name: "products_service_requests_time",
    help: "Get the response times of the requests",
    labelNames: ["method" , "route" , "status_code" ],
    buckets: [5 , 10 , 20 , 30 , 40 , 50 , 60 , 80 , 100 , 150 , 250 , 400 , 1000]
});

export const totalRequestsMetrics = new client.Counter({
    name: "products_service_total_requests",
    help: "Get the total number of requests",
    labelNames: ["method" , "route" , "status_code" ]
});

const monitoringMiddleware = responseTime((req: Request, res: Response, time: number) => {
    if (req.path === "/metrics" || req.path === "/favicon.ico") return;
  
    const route = req.url || "unknown";
  
    const method = req.method || "unknown";
    const statusCode = res.statusCode ? res.statusCode.toString() : "unknown";
  
    totalRequestsMetrics.labels(method, route, statusCode).inc();
    requestsTimeMetrics.labels(method, route, statusCode).observe(time);
  });
  

export default monitoringMiddleware;