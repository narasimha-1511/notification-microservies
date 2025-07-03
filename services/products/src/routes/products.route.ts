import express from "express";
import { addProduct, getAllProducts, getProductById } from "../controllers/product.controller";
import validate from "../middlewares/validate.middleware";
import z from "zod";

const router = express.Router();

const addProductSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.number().min(0),
    quantity: z.number().min(0)
});

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/product", validate(addProductSchema), addProduct);

export default router;