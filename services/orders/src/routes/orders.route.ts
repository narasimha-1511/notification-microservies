import express from "express";
import validate from "../middlewares/validate.middleware";
import z from "zod";
import { getOrderById, getAllOrders , placeOrder, updateOrderStatus, purchasedProductsByUserIds } from "../controllers/orders.controller";

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

const purchasedProductsByUserIdsSchema = z.object({
    userIds: z.array(z.string()).min(1),
});

router.post("/order", validate(placeOrderSchema), placeOrder);
router.get("/order/:id", getOrderById);
router.get("/orders", getAllOrders);
router.put("/order/:id", validate(updateOrderStatusSchema), updateOrderStatus);
router.post("/purchasedProductsByUserIds",validate(purchasedProductsByUserIdsSchema), purchasedProductsByUserIds);

export default router;