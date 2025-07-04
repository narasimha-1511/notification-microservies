import express from "express";
import validate from "../middlewares/validate.middleware";
import z from "zod";
import { getOrderById, getAllOrders , placeOrder, updateOrderStatus } from "../controllers/orders.controller";

const router = express.Router();

const placeOrderSchema = z.object({
    products: z.array(z.object({
        id: z.string(),
        quantity: z.number().min(1)
    })).min(1),
});

const updateOrderStatusSchema = z.object({
    status: z.enum(["PENDING", "DELIVERED", "CANCELLED" , "SHIPPED"]),
});

router.post("/order", validate(placeOrderSchema), placeOrder);
router.get("/order/:id", getOrderById);
router.get("/orders", getAllOrders);
router.put("/order/:id", validate(updateOrderStatusSchema), updateOrderStatus);

export default router;