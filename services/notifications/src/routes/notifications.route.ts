import express from "express";
import { getNotificationById, getNotifications, markAsRead, postNotification } from "../controllers/notifications.controller";
import { z } from "zod";
import validate from "../middlewares/validate.middleware";

const router = express.Router();    

const postNotificationSchema = z.object({
    type: z.enum(['PROMOTIONS', 'NEWSLETTER', 'ORDER_UPDATES', 'RECOMMENDATIONS']),
    content: z.string(),
})

router.post("/postNotification", validate(postNotificationSchema) ,  postNotification);
router.put("/markAsRead/:id",  markAsRead);
router.get("/notifications", getNotifications);
router.get("/notification/:id", getNotificationById);

export default router;