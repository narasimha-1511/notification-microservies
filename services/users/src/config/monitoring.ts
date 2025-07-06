import { Request, Response } from "express";
import client from "prom-client";
import responseTime from "response-time";

export const requestsTimeMetrics = new client.Histogram({
    name: "user_service_requests_time",
    help: "Get the response times of the requests",
    labelNames: ["method" , "route" , "status_code" ],
    buckets: [5 , 10 , 20 , 30 , 40 , 50 , 60 , 80 , 100 , 150 , 250 , 400 , 1000]
});

export const totalRequestsMetrics = new client.Counter({
    name: "user_service_total_requests",
    help: "Get the total number of requests",
    labelNames: ["method" , "route" , "status_code" ]
});

const monitoringMiddleware = (responseTime((req: Request , res: Response, time : number) => {
    requestsTimeMetrics.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    }).observe(time);
    totalRequestsMetrics.inc({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    });
}))

export default monitoringMiddleware;