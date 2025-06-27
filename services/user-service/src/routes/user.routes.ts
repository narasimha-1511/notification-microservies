import express from "express";
import { login, register } from "../controllers/user.controller";
import validate from "../middlewares/validate.middleware";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
})

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(4),
    preferences: z.array(z.enum(['promotions', 'newsletter', 'order_updates', 'recommendations'])).default(['recommendations']),
})

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);

export default router;