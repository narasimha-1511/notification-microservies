import express from "express";
import { addProduct, getAllProducts, getProductById, getProductsByIds, getRecommendations } from "../controllers/product.controller";
import validate from "../middlewares/validate.middleware";
import z from "zod";

const router = express.Router();

const addProductSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.number().min(0),
    quantity: z.number().min(0)
});

const getRecommendationsSchema = z.object({
    userIds: z.array(z.string()).min(1),
});

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/product", validate(addProductSchema), addProduct);

router.get("/productsByIds", getProductsByIds);

//made this post because we need to do batch requests
router.post("/recommendations", validate(getRecommendationsSchema), getRecommendations);

export default router;