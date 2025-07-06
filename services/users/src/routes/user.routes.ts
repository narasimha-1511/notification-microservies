import express from "express";
import { getUser, login, register, updateUserPreferences , getAllUsers} from "../controllers/user.controller";
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
    preferences: z.array(z.enum(['PROMOTIONS', 'NEWSLETTER', 'ORDER_UPDATES', 'RECOMMENDATIONS'])).default(['RECOMMENDATIONS']),
})

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get("/:userId", getUser);
router.put("/preferences", updateUserPreferences);

//using this internally 
router.get("/users" , getAllUsers);

export default router;